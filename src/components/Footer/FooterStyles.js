import styled from 'styled-components';

export const LogoTypesMinimal = styled.div`
  text-align: center;
  letter-spacing: 27px;

  a,
  > img {
    display: inline-block;
    vertical-align: middle;
    margin: 5px;
  }

  img {
    width: auto;
    height: 33px;
    object-fit: contain;

    max-width: 200px;
  }

  @media (max-width: 992px) {
    gap: 10px;

    img {
      width: auto;
      height: 24px;
    }
  }
`;

export const LogoTypes = styled.div`
  text-align: center;
  letter-spacing: 27px;

  a,
  > img {
    display: inline-block;
    vertical-align: middle;
    margin: 15px 10px;
  }

  img {
    width: auto;
    height: 33px;
    object-fit: contain;

    max-width: 200px;
  }

  @media (max-width: 992px) {
    gap: 10px;

    img {
      width: auto;
      height: 24px;
    }

    a,
    > img {
      margin: 10px 10px;
    }
  }
`;

export const Anotation = styled.div`
  margin: 20px 0;
  p {
    margin: 0 0 12px;
    text-align: left;
    font-size: 13px;
    line-height: 1.5;
    color: var(--footer-text-color);
  }

  @media (max-width: 992px) {
    font-size: 10px;
  }
`;
