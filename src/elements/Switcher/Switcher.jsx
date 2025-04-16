import React, { useCallback } from 'react';

export const Switcher = React.memo(({ textBefore, textAfter, onClick, isToggled, className = '' }) => {
  const handleClick = useCallback(() => {
    onClick && onClick();
  }, [onClick]);

  return (
    <div className={`switcher ${className}`}>
      <span className="name">{textBefore}</span>
      <label className={`toggle-switch${isToggled ? ' active' : ''}`}>
        <input type="checkbox" onClick={handleClick} />
        <span className="switch" />
      </label>
      <span className="name">{textAfter}</span>
    </div>
  );
});
