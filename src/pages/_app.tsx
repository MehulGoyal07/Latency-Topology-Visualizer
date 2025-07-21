import { LatencyProvider } from '@/contexts/LatencyContext';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../styles/globals';
import { defaultTheme } from '../styles/theme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <LatencyProvider>
        <Component {...pageProps} />
      </LatencyProvider>
    </ThemeProvider>
  );
}

export default MyApp;