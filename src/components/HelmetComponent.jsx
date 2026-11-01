import React from "react";
import { Helmet } from "react-helmet";

const HelmetComponent = ({ title, description, keywords, canonicalUrl, customMeta = [] }) => {
  const Domain_Url = import.meta.env.VITE_DOMAIN_URL;
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Dynamic canonical link */}
      {canonicalUrl && <link rel="canonical" href={`${Domain_Url}/${canonicalUrl}`} />}

      {/* Render custom meta tags dynamically */}
      {customMeta.map((meta, index) => (
        <meta key={index} {...meta} />
      ))}
    </Helmet>
  );
};

export default HelmetComponent;

