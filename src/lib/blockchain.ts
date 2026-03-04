import { createPublicClient, createWalletClient, http, custom } from 'viem';
import { hardhat } from 'viem/chains';

// In a real application, you'd use a provider like Alchemy/Infura for mainnet
// For local dev, we connect to Hardhat's default RPC
export const publicClient = createPublicClient({
    chain: hardhat,
    transport: http()
});

// A mock Private Key for the Admin/System wallet that signs transactions
// Hardhat Account #0
const systemPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

// Server-side wallet client
// In production, private keys MUST be stored securely (e.g. AWS KMS or Azure Key Vault)
import { privateKeyToAccount } from 'viem/accounts';

export const systemWalletAccount = privateKeyToAccount(systemPrivateKey as `0x${string}`);

export const walletClient = createWalletClient({
    account: systemWalletAccount,
    chain: hardhat,
    transport: http()
});
