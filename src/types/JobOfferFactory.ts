export enum ESolidityTypes {
  UINT = 'uint',
  ETH_VALUE = 'ethValue',
  ADDRESS = 'address',
  TIMESTAMP = 'timestamp',
}

export interface IRevertError {
  name: string;
  params: Array<{
    name: string;
    type: ESolidityTypes;
  }>;
}

interface chainData {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[];
}

export const chains: Record<number, chainData> = {
  5: {
    chainId: '0x5',
    chainName: 'Goerli',
    nativeCurrency: {
      name: 'Goerli Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://goerli.infura.io/v3/'],
    blockExplorerUrls: ['https://goerli.etherscan.io'],
  },
  11155111: {
    chainId: '0xaa36a7',
    chainName: 'Sepolia',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: [
      'https://sepolia.etherscan.io',
      'https://sepolia.otterscan.io',
    ],
  },
  42161: {
    chainId: '0xa4b1',
    chainName: 'Arbitrum One',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://arbitrum-mainnet.infura.io'],
    blockExplorerUrls: ['https://explorer.arbitrum.io', 'https://arbiscan.io'],
  },
  10: {
    chainId: '0xa',
    chainName: 'Optimism',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.optimism.io/'],
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
  },
  1: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  43114: {
    chainId: '0xa86a',
    chainName: 'Avalanche C-Chain',
    nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
    rpcUrls: [
      'https://api.avax.network/ext/bc/C/rpc',
      'https://avalanche-c-chain.publicnode.com',
    ],
  },
  80001: {
    chainId: '0x13881',
    chainName: 'Mumbai',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: [
      'https://matic-mumbai.chainstacklabs.com',
      'https://rpc-mumbai.maticvigil.com',
      'https://matic-testnet-archive-rpc.bwarelabs.com',
    ],
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
  },
  31337: {
    chainId: '0x7a69',
    chainName: 'local dev chain',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['http://127.0.0.1:8545/'],
  },
};

export const devChains: Array<number> = [31337, 80001, 11155111, 5];

export const factoryDeployBlockNumber: Record<number, number> = {
  80001: 33222253,
  5: 8670159,
  11155111: 3108462,
  31337: 0,
};

export const ContractsErrors: Record<string, IRevertError> = {
  JobOfferFactory_not_enough_eth_funded: {
    name: 'Not enough eth',
    params: [
      {
        name: 'required',
        type: ESolidityTypes.ETH_VALUE,
      },
      {
        name: 'balance',
        type: ESolidityTypes.ETH_VALUE,
      },
    ],
  },
  JobOfferFactory_not_all_offers_closed: {
    name: 'Not all offers closed',
    params: [],
  },
  JobOfferFactory_zero_balance: {
    name: 'Zero balance',
    params: [],
  },
  JobOfferFactory_transaction_not_successful: {
    name: 'Transaction not successful',
    params: [],
  },
  JobOfferFactory_not_valid_offer: {
    name: 'Non valid offer',
    params: [
      {
        name: 'address',
        type: ESolidityTypes.ADDRESS,
      },
    ],
  },
  JobOfferFactory_employer_does_not_have_enough_balance: {
    name: 'Employer does not have enough balance',
    params: [],
  },
  JobOffer_not_enough_amount: {
    name: 'Not enough funded',
    params: [
      {
        name: 'amount',
        type: ESolidityTypes.ETH_VALUE,
      },
    ],
  },
  JobOffer_not_employee: {
    name: 'This action provided only to employee',
    params: [],
  },
  JobOffer_not_employer: {
    name: 'This action provided only to employer',
    params: [],
  },
  JobOffer_invalid_sender: {
    name: 'You do not have permission for this action',
    params: [],
  },
  JobOffer_transaction_not_successful: {
    name: 'Transaction not successful',
    params: [],
  },
  JobOffer_payment_not_needed: {
    name: 'Payment is not available yet',
    params: [],
  },
  JobOffer_wrong_offer_type: {
    name: 'This action is not available in this type of contract',
    params: [],
  },
  JobOffer_is_not_keeper_compatible: {
    name: 'This contract is not keeper compatible',
    params: [],
  },
  JobOffer_not_closed: {
    name: 'This action available only in closed contract',
    params: [],
  },
  JobOffer_wrong_state: {
    name: 'This action is not available in this state of contract',
    params: [],
  },
  JobOffer_not_all_hours_paided: {
    name: 'Withdraw is unavailable until all hours would be paided',
    params: [],
  },
};
