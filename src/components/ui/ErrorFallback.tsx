import styled from 'styled-components';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary?: () => void;
}

export default function ErrorFallback({ error }: ErrorFallbackProps) {
  return (
    <Container>
      <Box>
        <h2>🚨 Something went wrong</h2>
        <Message>{error.message}</Message>
        <RetryButton onClick={() => window.location.reload()}>
          🔄 Try Again
        </RetryButton>
      </Box>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: #fef2f2;
`;

const Box = styled.div`
  background: white;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Message = styled.pre`
  color: #d32f2f;
  font-size: 1rem;
  margin: 1rem 0;
`;

const RetryButton = styled.button`
  background-color: #d32f2f;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;

  &:hover {
    background-color: #b71c1c;
  }
`;
