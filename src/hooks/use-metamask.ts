"use client";

import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

export interface MetaMaskState {
  walletAddress: string | null;
  network: string | null;
  balance: number;
  isConnected: boolean;
  isMetaMaskInstalled: boolean;
}

export interface EscrowTransaction {
  id: string;
  type: 'lock' | 'release' | 'refund' | 'penalty';
  amount: number;
  timestamp: string;
  orderId?: string;
}

const STORAGE_KEYS = {
  WALLET_ADDRESS: 'metamask_wallet_address',
  NETWORK: 'metamask_network',
  BALANCE: 'metamask_fake_balance',
  TRANSACTIONS: 'metamask_transactions',
} as const;

const DEFAULT_BALANCE = 10000; // ₹10,000 fake balance
const PENALTY_RATE = 0.15; // 15% penalty for no-show

export function useMetaMask() {
  const [state, setState] = useState<MetaMaskState>({
    walletAddress: null,
    network: null,
    balance: DEFAULT_BALANCE,
    isConnected: false,
    isMetaMaskInstalled: false,
  });
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize state from localStorage and detect MetaMask
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMetaMask = () => {
      const isInstalled = !!window.ethereum?.isMetaMask;
      const savedAddress = localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS);
      const savedNetwork = localStorage.getItem(STORAGE_KEYS.NETWORK);
      const savedBalance = localStorage.getItem(STORAGE_KEYS.BALANCE);

      setState(prev => ({
        ...prev,
        walletAddress: savedAddress,
        network: savedNetwork,
        balance: savedBalance ? parseFloat(savedBalance) : DEFAULT_BALANCE,
        isConnected: !!savedAddress,
        isMetaMaskInstalled: isInstalled,
      }));
    };

    // Check immediately
    checkMetaMask();

    // Poll for a few seconds in case of async injection
    const interval = setInterval(checkMetaMask, 1000);
    const timeout = setTimeout(() => clearInterval(interval), 5000);

    const savedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accountsArray = accounts as string[];
      if (accountsArray.length === 0) {
        disconnect();
      } else {
        const newAddress = accountsArray[0];
        localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, newAddress);
        setState(prev => ({
          ...prev,
          walletAddress: newAddress,
          isConnected: true,
        }));
      }
    };

    const handleChainChanged = (chainId: unknown) => {
      const network = getNetworkName(chainId as string);
      localStorage.setItem(STORAGE_KEYS.NETWORK, network);
      setState(prev => ({ ...prev, network }));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  const getNetworkName = (chainId: string): string => {
    const networks: Record<string, string> = {
      '0x1': 'Ethereum Mainnet',
      '0x5': 'Goerli Testnet',
      '0xaa36a7': 'Sepolia Testnet',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Polygon Mumbai',
      '0x38': 'BSC Mainnet',
    };
    return networks[chainId] || `Chain ${parseInt(chainId, 16)}`;
  };

  const connect = useCallback(async () => {
    if (!window.ethereum?.isMetaMask) {
      throw new Error('MetaMask is not installed. Please install MetaMask extension.');
    }

    setIsLoading(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];

      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      }) as string;

      const address = accounts[0];
      const network = getNetworkName(chainId);

      // Persist to localStorage
      localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, address);
      localStorage.setItem(STORAGE_KEYS.NETWORK, network);

      // Initialize balance if not set
      if (!localStorage.getItem(STORAGE_KEYS.BALANCE)) {
        localStorage.setItem(STORAGE_KEYS.BALANCE, DEFAULT_BALANCE.toString());
      }

      setState(prev => ({
        ...prev,
        walletAddress: address,
        network,
        isConnected: true,
        isMetaMaskInstalled: true,
      }));

      return address;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS);
    localStorage.removeItem(STORAGE_KEYS.NETWORK);
    setState(prev => ({
      ...prev,
      walletAddress: null,
      network: null,
      isConnected: false,
    }));
  }, []);

  const saveTransaction = useCallback((tx: EscrowTransaction) => {
    setTransactions(prev => {
      const updated = [...prev, tx];
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateBalance = useCallback((newBalance: number) => {
    localStorage.setItem(STORAGE_KEYS.BALANCE, newBalance.toString());
    setState(prev => ({ ...prev, balance: newBalance }));
  }, []);

  // Lock amount for escrow (when order is placed)
  const lockAmount = useCallback(async (amount: number, orderId?: string): Promise<boolean> => {
    if (state.balance < amount) {
      throw new Error(`Insufficient balance. Available: ₹${state.balance.toFixed(2)}, Required: ₹${amount.toFixed(2)}`);
    }

    setIsLoading(true);
    try {
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newBalance = state.balance - amount;
      updateBalance(newBalance);

      const tx: EscrowTransaction = {
        id: `tx_${Date.now()}`,
        type: 'lock',
        amount,
        timestamp: new Date().toISOString(),
        orderId,
      };
      saveTransaction(tx);

      return true;
    } finally {
      setIsLoading(false);
    }
  }, [state.balance, updateBalance, saveTransaction]);

  // Release amount to pharmacy (when order is delivered/collected)
  const releaseAmount = useCallback(async (amount: number, orderId?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const tx: EscrowTransaction = {
        id: `tx_${Date.now()}`,
        type: 'release',
        amount,
        timestamp: new Date().toISOString(),
        orderId,
      };
      saveTransaction(tx);

      // Amount goes to pharmacy, not returned to user
      return true;
    } finally {
      setIsLoading(false);
    }
  }, [saveTransaction]);

  // Refund amount to user (when order is cancelled before preparation)
  const refundAmount = useCallback(async (amount: number, orderId?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newBalance = state.balance + amount;
      updateBalance(newBalance);

      const tx: EscrowTransaction = {
        id: `tx_${Date.now()}`,
        type: 'refund',
        amount,
        timestamp: new Date().toISOString(),
        orderId,
      };
      saveTransaction(tx);

      return true;
    } finally {
      setIsLoading(false);
    }
  }, [state.balance, updateBalance, saveTransaction]);

  // Charge penalty for no-show
  const chargePenalty = useCallback(async (amount: number, orderId?: string): Promise<{ penaltyAmount: number; refundAmount: number }> => {
    setIsLoading(true);
    try {
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const penaltyAmount = amount * PENALTY_RATE;
      const refundAfterPenalty = amount * (1 - PENALTY_RATE);

      // Refund partial amount (after penalty deduction)
      const newBalance = state.balance + refundAfterPenalty;
      updateBalance(newBalance);

      const tx: EscrowTransaction = {
        id: `tx_${Date.now()}`,
        type: 'penalty',
        amount: penaltyAmount,
        timestamp: new Date().toISOString(),
        orderId,
      };
      saveTransaction(tx);

      return { penaltyAmount, refundAmount: refundAfterPenalty };
    } finally {
      setIsLoading(false);
    }
  }, [state.balance, updateBalance, saveTransaction]);

  // Add funds (for demo purposes)
  const addFunds = useCallback((amount: number) => {
    const newBalance = state.balance + amount;
    updateBalance(newBalance);
  }, [state.balance, updateBalance]);

  // Reset balance (for demo purposes)
  const resetBalance = useCallback(() => {
    updateBalance(DEFAULT_BALANCE);
    setTransactions([]);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  }, [updateBalance]);

  return {
    ...state,
    transactions,
    isLoading,
    connect,
    disconnect,
    lockAmount,
    releaseAmount,
    refundAmount,
    chargePenalty,
    addFunds,
    resetBalance,
    PENALTY_RATE,
  };
}
