import React from "react";

const TextError = (props) => {
  return (
    <div>
      <p style={{fontSize: '0.75rem', fontWeight: 400, color: "#f7412d"}}>{props.error}</p>
    </div>
  )
};

export default TextError;
