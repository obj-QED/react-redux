import styled from 'styled-components';

const Spinner = styled.div`
  .spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
  }

  .spinner__loading {
    border: 4px solid rgb(255 255 255 / 10%);
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Preloader = styled.div`
  &::after {
    display: block;
    content: '';
    width: 64px;
    height: 64px;
    animation: spin 1s linear infinite;
    background: var(--preloader-bg-spinner);
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;

export const AnimatedPreloader = ({ spinner }) => {
  const renderSpinner = () => {
    return (
      <Spinner className="spinner">
        <div className="spinner__loading"></div>
      </Spinner>
    );
  };

  const renderPreloader = () => {
    return (
      <Preloader className="spinner">
        <div className="spinner__loading"></div>
      </Preloader>
    );
  };

  switch (spinner) {
    case 'spinner':
      return renderSpinner();
    case 'preloader':
      return renderPreloader();
    default:
      return renderSpinner();
  }
};
