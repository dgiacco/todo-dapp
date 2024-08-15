import { MetaMaskInpageProvider } from "@metamask/providers";
import { ContractInterface } from 'ethers';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }

  const contractABI: ContractInterface;
}