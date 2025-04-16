import styled, { css } from 'styled-components';

export const Text = styled.div`
  ${(props) =>
    props?.icon
      ? css`
          position: relative;
          top: -2px;
          background: url(/images/icons/banners/${(props) => props?.icon}.svg) no-repeat left center;
        `
      : null}
`;

export const Label = styled.div`
  background: ${(props) => props?.labelBackground};
`;
