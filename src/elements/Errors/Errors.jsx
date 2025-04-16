import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { translateField } from '../../shared/utils';

const Errors = memo(({ errorMessages, styled = '', translate = true }) => {
  const words = useSelector((state) => state.words);

  const messages = useMemo(() => (translate ? errorMessages?.map((msg) => translateField(msg, words, false)) : errorMessages), [errorMessages, words, translate]);

  if (!messages?.length) return null;

  const renderMessages = () =>
    messages?.map((msg, index) => (
      <p key={index} className="message">
        {msg}
      </p>
    ));

  switch (styled) {
    case 'inline':
      return <div className="inline">{renderMessages()}</div>;
    case 'block':
      return <div className="block">{renderMessages()}</div>;
    default:
      return null;
  }
});

const ErrorsMain = memo(({ errorMessages, styled = '', position = 'left', translate = true, className }) => {
  if (!errorMessages?.length && styled) return null;

  return (
    <div
      className={classNames('errors-main', {
        position_left: position === 'left',
        position_right: position === 'right',
        position_center: position === 'center',
        [className]: className,
      })}
    >
      <Errors errorMessages={errorMessages} styled={styled} translate={translate} />
    </div>
  );
});

export default ErrorsMain;
