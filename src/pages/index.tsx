import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Loader } from '../components/ui/Loader';

// Dynamically import with no SSR
const WorldMap = dynamic(() => import('../components/map/WorldMap'), {
  ssr: false,
  loading: () => <Loader />,
});

const Home = () => {
  const [isMounted, setIsMounted] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    <>
      <Head>
        <title>GoQuant Latency Visualizer</title>
        <meta name="description" content="3D Latency Topology Visualizer" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainContainer theme={theme}>
        {isMounted ? <WorldMap /> : <Loader />}
      </MainContainer>
    </>
  );
};

const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background};
  transition: background-color 0.3s ease;

  @media (max-width: 768px) {
    height: calc(var(--vh, 1vh) * 100);
  }
`;

export default Home;