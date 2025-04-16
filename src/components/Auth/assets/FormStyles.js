import styled from 'styled-components';

export const Error = styled.div`
  margin-top: 4px;
  color: red;
`;

export const FieldInput = styled.div`
  input {
    &::placeholder {
      color: white;
    }
    &:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px var(--webkit-autofill, rgb(38, 38, 38)) inset !important;
      transition: background-color 50000s ease-in-out 0s;
      -webkit-text-fill-color: var(--webkit-autofill-color, #fff) !important;
    }
  }
  .react-international-phone-input-container {
    border-radius: 50%;
    height: var(--auth-forms__input-height);
    background: var(--auth-forms__input-phone-bg, #262626);

    .react-international-phone-input,
    .react-international-phone-country-selector {
      height: var(--auth-forms__input-height);
      background: var(--auth-forms__input-phone-bg, #262626) !important;

      border: 0;
      color: var(--auth-forms__input-phone-color, #fff);
      margin: 0;
      > button {
        padding-left: 7px;
        height: var(--auth-forms__input-height);
        background: var(--auth-forms__input-phone-bg-btn, #ffffff26);
        border: 1px solid var(--auth-forms__input-phone-bg-btn-border, rgba(255, 255, 255, 0.15));
        border-bottom-left-radius: 5px;
        border-top-left-radius: 5px;
      }
    }
    .react-international-phone-input {
      border-bottom-right-radius: 5px;
      border-top-right-radius: 5px;
    }
    .react-international-phone-country-selector {
      border-bottom-left-radius: 5px;
      border-top-left-radius: 5px;
    }
  }
`;

export const BlockButton = styled.div``;

export const SocialLoginButton = styled.div``;
