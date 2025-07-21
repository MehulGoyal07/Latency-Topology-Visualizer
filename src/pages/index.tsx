import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Loader } from '../components/ui/Loader';

// Dynamically import the 3D map to avoid SSR issues
const WorldMap = dynamic(() => import('../components/map/WorldMap'), {
  ssr: false,
  loading: () => <Loader />,
});

const Home = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>GoQuant Latency Visualizer</title>
        <meta name="description" content="3D Latency Topology Visualizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainContainer>
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
`;

export default Home;