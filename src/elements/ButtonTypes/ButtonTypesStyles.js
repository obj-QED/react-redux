import styled from 'styled-components';

export const Button = styled.button`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  border: none;
  padding: var(--btn--${(props) => props['data-attr']}__padding);
  border-radius: var(--btn--${(props) => props['data-attr']}__radius);
  box-shadow: var(--btn--${(props) => props['data-attr']}__border);
  background: var(--btn--${(props) => props['data-attr']}__bg);
  color: var(--btn--${(props) => props['data-attr']}__color);
  transition: all 0.4s ease;

  .arrow-left {
    width: var(--btn--back-history__icon-width, 16px);
  }

  .arrow-left path {
    transition: all 0.4s ease;
    stroke: var(--btn--back-history__color);
  }

  &:hover {
    box-shadow: var(--btn--${(props) => props['data-attr']}__border-hover);
    background: var(--btn--${(props) => props['data-attr']}__bg-hover);
    color: var(--btn--${(props) => props['data-attr']}__color-hover);

    .arrow-left path {
      stroke: var(--btn--back-history__color-hover);
    }

    .icon-toggle {
      border-color: var(--btn--games-wallet__color-hover);
    }
  }

  @media (max-width: 992px) {
    padding: var(--btn--${(props) => props['data-attr']}__padding--mobile);
  }
`;
