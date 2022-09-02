import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { access, mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import pinataSDK, { PinataClient } from '@pinata/sdk';

import { CONFIG } from './config';
import { logger } from "./logger";

export class MetadataStorage {
    public initialized = false;

    private ipfsClient: IPFSHTTPClient;
    private pinataClient?: PinataClient;

    constructor() {
        this.ipfsClient = create({ url: CONFIG.IPFS_NODE });

        if (CONFIG.PINATA_API_KEY && CONFIG.PINATA_SECRET_API_KEY) {
            this.pinataClient = pinataSDK(CONFIG.PINATA_API_KEY, CONFIG.PINATA_SECRET_API_KEY);
        }
    }

    async initialize() {
        if (this.initialized) {
            return;
        }
        
        await this.checkAndCreateDataDirectory();

        if (this.pinataClient) {
            const result = await this.pinataClient.testAuthentication();

            if (!result.authenticated) {
                throw new Error(`Can't authenticate with Pinata service.`);
            }
        }

        this.initialized = true;
    }

    getDataPath() {
        return path.join(__dirname, CONFIG.DATA_LOCATION);
    }

    async checkAndCreateDataDirectory() {
        const dataPath = this.getDataPath();
        try {
            await access(dataPath);
        } catch (error) {
            await mkdir(dataPath);
        }
    }

    async storeFile(content: string) {
        const { cid } = await this.ipfsClient.add(content, {
            onlyHash: true,
            cidVersion: 1
        });

        const fileName = `${cid}.json`;
        const filePath = path.join(__dirname, `../data/${fileName}`);
        let existingFileLocally: Buffer | null = null;

        try {
            existingFileLocally = await readFile(filePath);
        } catch (error) {}

        if (!existingFileLocally) {
            await writeFile(filePath, content);
        }

        let fileExistsInIPFS = false;
        try {
            const existingFileInIPFS = await this.ipfsClient.cat(cid, {
                timeout: CONFIG.IPFS_EXISTING_FILE_CHECK_TIMEOUT
            });

            const resultsFromIPFS = [];
            for await (const chunk of existingFileInIPFS) {
                resultsFromIPFS.push(chunk);
            }

            fileExistsInIPFS = true;
        } catch (error) {}

        if (!fileExistsInIPFS) {
            await this.ipfsClient.add(content, {
                cidVersion: 1
            });
            logger.info(`Uploaded ${fileName} to IPFS.`);
        }

        if (this.pinataClient) {
            await this.pinataClient.pinByHash(cid.toString(), {
                pinataMetadata: {
                    name: fileName
                }
            });
            logger.info(`Requested to pin ${fileName} in Pinata.`);
        }

        return cid;
    }
}