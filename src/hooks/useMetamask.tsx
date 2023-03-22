import React, { type PropsWithChildren, useEffect } from 'react';

import { chains } from '@/types';

type ConnectAction = { type: 'connect'; wallet: string; chainId: string };
type DisconnectAction = { type: 'disconnect' };
type PageLoadedAction = {
  type: 'pageLoaded';
  isMetamaskInstalled: boolean;
  wallet?: string;
  chainId?: string;
};
type LoadingAction = { type: 'loading' };

type SwitchChainAction = { type: 'switch'; chainId: number };

type Action =
  | ConnectAction
  | DisconnectAction
  | PageLoadedAction
  | LoadingAction
  | SwitchChainAction;

type Dispatch = (action: Action) => void;

type Status = 'loading' | 'idle' | 'pageNotLoaded';

type State = {
  wallet?: string;
  chainId?: string;
  isMetamaskInstalled: boolean;
  status: Status;
};

const MetamaskContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const initialState: State = {
  wallet: undefined,
  chainId: undefined,
  isMetamaskInstalled: false,
  status: 'loading',
} as const;

const reload = () => {
  window.location.reload();
};

const setListeners = () => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', reload);
    window.ethereum.on('chainChanged', reload);
  }
};

const removeListeners = () => {
  if (window.ethereum && window.ethereum.removeListener) {
    window.ethereum.removeListener('accountsChanged', reload);
    window.ethereum.removeListener('chainChanged', reload);
  }
};

const getCredentials = async () => {
  const [accounts, chainId] = await Promise.all([
    await window.ethereum.request({ method: 'eth_accounts' }),
    await window.ethereum.request({ method: 'eth_chainId' }),
  ]);
  return { wallet: accounts[0], chainId };
};

const switchChain = async (chainId: number) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (e) {
    const chain = chains[chainId];
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{ ...chain }],
    });
  }
};

function metamaskReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'connect': {
      const { wallet, chainId } = action;
      return { ...state, wallet, status: 'idle', chainId };
    }
    case 'disconnect': {
      return { ...state, wallet: undefined, chainId: undefined };
    }
    case 'pageLoaded': {
      const { isMetamaskInstalled, chainId, wallet } = action;
      setListeners();
      return { ...state, isMetamaskInstalled, status: 'idle', chainId, wallet };
    }
    case 'loading': {
      return { ...state, status: 'loading' };
    }
    case 'switch': {
      const { chainId } = action;
      switchChain(chainId);
      return state;
    }
    default: {
      throw new Error('Unhandled action type');
    }
  }
}

function MetamaskProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = React.useReducer(metamaskReducer, initialState);
  const value = { state, dispatch };

  useEffect(() => {
    if (typeof window !== undefined) {
      const ethereumProviderInjected = typeof window.ethereum !== 'undefined';
      const isMetamaskInstalled =
        ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);
      if (isMetamaskInstalled) {
        getCredentials().then(({ wallet, chainId }) => {
          dispatch({
            type: 'pageLoaded',
            isMetamaskInstalled,
            wallet,
            chainId,
          });
        });
      } else {
        dispatch({
          type: 'pageLoaded',
          isMetamaskInstalled,
        });
      }
    }
    return removeListeners;
  }, []);

  return (
    <MetamaskContext.Provider value={value}>
      {children}
    </MetamaskContext.Provider>
  );
}

function useMetamask() {
  const context = React.useContext(MetamaskContext);
  if (context === undefined) {
    throw new Error('useMetamask must be used within a MetamaskProvider');
  }
  return context;
}

export { MetamaskProvider, useMetamask };
