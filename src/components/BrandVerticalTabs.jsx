import React, { useEffect, useState } from 'react';
import { IcLink } from '../assets/icons/IcLink';
// import { IcNoFile } from '../assets/icons/IcNofile';
import { useUser } from '../context/UserContext';

const getProductDetailFiles = (item) => {
  if (Array.isArray(item?.files) && item.files.length > 0) {
    return item.files
      .map((file, index) => ({
        id: file?.id ?? index,
        title: file?.title || file?.text || file?.file_name || item?.text,
        fileName: file?.file_name || file?.name || file?.title || file?.text,
        url: file?.file_url || file?.url || file?.file,
      }))
      .filter((file) => file.url);
  }

  const urls = Array.isArray(item?.url)
    ? item.url
    : Array.isArray(item?.urls)
    ? item.urls
    : item?.url
    ? [item.url]
    : [];

  return urls
    .filter((url) => typeof url === 'string' && url.trim() !== '')
    .map((url, index) => ({
      id: index,
      title: item?.text,
      fileName: url,
      url,
    }));
};

// Get file extension from file name or URL
const getFileExtension = (file) => {
  const fileName = file?.fileName || file?.url || '';

  // Remove query parameters and hash
  const cleanFileName = fileName.split('?')[0].split('#')[0];

  // Get extension
  const extension = cleanFileName.split('.').pop();

  if (
    extension &&
    extension !== cleanFileName &&
    /^[a-zA-Z0-9]+$/.test(extension)
  ) {
    return extension.toLowerCase();
  }

  return 'file';
};

const BrandVerticalTabs = ({ brands, contentData, setIsBandId }) => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState(0);
  const [expandedKey, setExpandedKey] = useState(null);

  useEffect(() => {
    setExpandedKey(null);
  }, [contentData]);

  const toggleDetail = (detailKey) => {
    setExpandedKey((current) => (current === detailKey ? null : detailKey));
  };

  const visibleDetails = Array.isArray(contentData)
    ? contentData.filter((item) => item?.text?.trim())
    : [];

  const validBrands = Array.isArray(brands)
    ? brands.filter((b) => {
        if (b == null) return false;

        if (Array.isArray(b)) {
          return b.length > 0;
        }

        if (typeof b === 'object') {
          return (
            Object.keys(b).length > 0 &&
            (b.product_name || b.product_logo || b.id)
          );
        }

        return false;
      })
    : [];

  return (
    <div className="container-fluid brand-vertical-main">
      <div className="container">
        <div className="row brand-vertical-tabs">
          <div
            className={`col-lg-7 col-md-7 p-0 ${
              user?.role_id === 1
                ? 'brand-vertical-left-div'
                : 'brand-vertical-left-div-home'
            }`}
          >
            <div>
              {validBrands.length > 0 ? (
                validBrands.map((brand, index) => (
                  <div
                    key={brand.id ?? index}
                    className={`tab-item d-flex align-items-center bg-color-white ${
                      activeTab === index ? 'active' : ''
                    }`}
                    onClick={() => {
                      setActiveTab(index);
                      setIsBandId(brand?.id ?? null);
                    }}
                  >
                    <div className="me-3">
                      <img
                        src={brand?.product_logo || '/path/to/default-logo.png'}
                        className="company-icon"
                        alt={brand?.product_name || 'company-icon'}
                        loading="lazy"
                      />
                    </div>

                    <div>
                      <h6 className="brand-name mb-0">
                        {brand?.product_name || 'Unknown Brand'}
                      </h6>
                    </div>
                  </div>
                ))
              ) : (
                <p
                  className="text-end mt-5"
                  style={{
                    color: '#12BC4E',
                    fontSize: '24px',
                    fontWeight: '600',
                  }}
                >
                  There is no product available
                </p>
              )}
            </div>
          </div>

          {/* Content - Right Side */}
          <div className="col-lg-5 col-md-5" style={{ padding: '8px 16px' }}>
            <div className="bg-white">
              <div className="list-group list-group-flush">
                {visibleDetails.map((item, index) => {
                  const detailKey = item.key ?? index;
                  const files = getProductDetailFiles(item);
                  const isExpanded = expandedKey === detailKey;

                  return (
                    <div key={detailKey} className="quickLinks">
                      <ul className="list-unstyled quickLinkList mb-0">
                        <li>
                          {/* Product Detail Title */}
                          <span
                            className="quickLinkItems"
                            onClick={() => toggleDetail(detailKey)}
                            style={{
                              cursor: 'pointer',
                              backgroundColor: isExpanded ? '#EFFEF4' : '',
                              color: isExpanded ? '#11843A' : '',
                            }}
                          >
                            <IcLink />

                            <span className="ms-3">{item.text}</span>
                          </span>

                          {/* Files */}
                          {files.length > 0 && (
                            <ul className="list-unstyled mt-2">
                              {files.map((file) => {
                                const extension = getFileExtension(file);

                                return (
                                  <li key={file.id} className="sub-li-text">
                                    <a
                                      href={file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-decoration-none sub-Links d-flex align-items-center"
                                      style={{
                                        color: '#0066CC',
                                      }}
                                    >
                                      <IcLink />

                                      
<span
  className="ms-2"
  title={file.url}
  style={{
    display: 'inline-block',
    maxWidth: '250px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
  }}
>
  {file.url}
</span>

                                    </a>
                                  </li>
                                );
                              })}
                            </ul>
                          )}

                        
                        </li>
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandVerticalTabs;
