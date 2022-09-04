import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const EVM_PRIVATE_KEY = process.env.EVM_PRIVATE_KEY;

if (!process.env.CKB_INDEXER_RPC_URL || !process.env.CKB_NODE_RPC_URL || !EVM_PRIVATE_KEY || !process.env.IPFS_NODE || !process.env.MNFT_METADATA_LOCATION) {
    throw new Error(`Environment variables "CKB_INDEXER_RPC_URL", "CKB_NODE_RPC_URL", "EVM_PRIVATE_KEY", "IPFS_NODE", "MNFT_METADATA_LOCATION" are mandatory.`);
}

export const CONFIG = {
    CKB_INDEXER_RPC_URL: process.env.CKB_INDEXER_RPC_URL,
    CKB_NODE_RPC_URL: process.env.CKB_NODE_RPC_URL,

    IPFS_NODE: process.env.IPFS_NODE,
    IPFS_EXISTING_FILE_CHECK_TIMEOUT: 10000,
    
    MNFT_ISSUER_TYPE_CODE_HASH: "0xb59879b6ea6fff985223117fa499ce84f8cfb028c4ffdfdf5d3ec19e905a11ed",
    MNFT_CLASS_TYPE_CODE_HASH: "0x095b8c0b4e51a45f953acd1fcd1e39489f2675b4bc94e7af27bb38958790e3fc",
    MNFT_TYPE_CODE_HASH: "0xb1837b5ad01a88558731953062d1f5cb547adf89ece01e8934a9f0aeed2d959f",

    UNIPASS_V2_CODE_HASH: "0x124a60cd799e1fbca664196de46b3f7f0ecb7138133dcaea4893c51df5b02be6",

    LAYER_ONE_BRIDGE_ETH_ADDRESS: '0x350595e9e62cba0d725c7cca7047dd2993f5cec6',

    EVM_RPC: 'https://godwoken-testnet-v1.ckbapp.dev',
    EVM_CONTRACTS: {
        BRIDGE: '0x54B8d8E2455946f2A5B8982283f2359812e815ce'
    },
    EVM_PRIVATE_KEY,

    MNFT_METADATA_LOCATION: process.env.MNFT_METADATA_LOCATION,

    PENDING_LAYER_1_MNFTS_CHECK_FREQUENCY: 300000,

    PINATA_API_KEY: process.env.PINATA_API_KEY,
    PINATA_SECRET_API_KEY: process.env.PINATA_SECRET_API_KEY
}