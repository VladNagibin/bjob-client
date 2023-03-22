import 'react-toastify/dist/ReactToastify.css';
import '../styles/global.scss';

import { Box, Container } from '@mui/material';
import { blue } from '@mui/material/colors';
import { ThemeProvider } from '@mui/system';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import Web3 from 'web3';

import Header from '@/components/Header';
import { MetamaskProvider } from '@/hooks/useMetamask';
import { theme } from '@/services';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <MetamaskProvider>
      <ThemeProvider theme={theme}>
        <Box sx={{ bgcolor: blue[50], minHeight: '830px' }}>
          <Header />
          <Container>
            <Component {...pageProps} />
          </Container>
        </Box>
        <ToastContainer />
      </ThemeProvider>
    </MetamaskProvider>
  );
}

export const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
web3.eth.handleRevert = true;
