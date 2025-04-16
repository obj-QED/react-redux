import styled, { css } from 'styled-components';

export const Text = styled.div`
  ${(props) => {
    const backgroundUrl = `var(--deposit-icon-banner-${props.icon})`;

    return css`
      background: ${backgroundUrl};
      height: 42px;
    `;
  }}
`;
