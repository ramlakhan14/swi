import React from "react";

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="spinner-border" role="status" style={{color:"#12BC4E"}}>
      </div>
    </div>
  );
};

export default Loader;