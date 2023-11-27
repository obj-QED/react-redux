// eslint-disable-next-line
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.useOutsideClick = void 0;
var _react = require('react');
const useOutsideClick = function useOutsideClick(ref, callback) {
  let active = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };
  (0, _react.useEffect)(() => {
    active && document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};
exports.useOutsideClick = useOutsideClick;
