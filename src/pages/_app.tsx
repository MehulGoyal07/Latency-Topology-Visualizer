import ErrorFallback from '@/components/ui/ErrorFallback';
import { LatencyProvider } from '@/contexts/LatencyContext';
import type { AppProps } from 'next/app';
import { ErrorBoundary } from 'react-error-boundary';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../styles/globals';
import { defaultTheme } from '../styles/theme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error) => {
        console.error('App Error:', error);
      }}
    >
      <ThemeProvider theme={defaultTheme}>
        <GlobalStyle />
        <LatencyProvider>
          <Component {...pageProps} />
        </LatencyProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default MyApp;