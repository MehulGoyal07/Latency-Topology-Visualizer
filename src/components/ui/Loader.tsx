import styled from 'styled-components';

export const Loader = () => {
  return (
    <LoaderContainer>
      <Spinner>
        <SpinnerInner />
        <SpinnerOuter />
      </Spinner>
      <LoadingText>Loading 3D Map...</LoadingText>
      <ProgressIndicator />
    </LoaderContainer>
  );
};

const LoaderContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 300px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
`;

const Spinner = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
  
  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
  }
`;

const SpinnerOuter = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: spin 1.5s linear infinite;
`;

const SpinnerInner = styled.div`
  position: absolute;
  top: 20%;
  left: 20%;
  width: 60%;
  height: 60%;
  border: 4px solid transparent;
  border-radius: 50%;
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: spinReverse 1s linear infinite;
  opacity: 0.8;

  @keyframes spinReverse {
    to {
      transform: rotate(-360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin: 24px 0 16px;
  color: ${({ theme }) => theme.colors.text};
  font-size: clamp(1rem, 2vw, 1.3rem);
  font-weight: 500;
  text-align: center;
`;

const ProgressIndicator = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    width: 50%;
    height: 100%;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 2px;
    animation: progress 2s ease-in-out infinite;
  }

  @keyframes progress {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
`;

