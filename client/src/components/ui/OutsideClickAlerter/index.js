import React, {useRef, useEffect} from 'react';

export default (props) => {
  const wrapperRef = useRef(null);

  const handleClick = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      props.onOutsideClick();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    }
  });

  return (
    <div ref={wrapperRef}>
      {props.children}
    </div>
  )
}