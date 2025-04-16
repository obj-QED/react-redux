import React, { memo } from 'react';

import { default as Forgot } from '../_path/_Forgot';

const ForgotPassword = memo(() => {
  return (
    <div className="auth-form">
      <div className="auth-form_wrapper auth-form_forgot">
        <Forgot />
      </div>
    </div>
  );
});

export default ForgotPassword;
