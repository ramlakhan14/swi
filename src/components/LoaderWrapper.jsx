import React, { useState, useEffect } from "react";
import { registerLoader } from "../utils/loaderManager";
import Loader from "./Loader";

const LoaderWrapper = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    registerLoader(
      () => setVisible(true), 
      () => setVisible(false) 
    );
  }, []);

  return visible ? <Loader /> : null;
};

export default LoaderWrapper;
