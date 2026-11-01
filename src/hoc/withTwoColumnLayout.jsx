import React from 'react';

const withTwoColumnLayout = (
  LeftComponent,
  RightComponent = null,
  options = {},
) => {
  const currentYear = new Date().getFullYear();
  const {
    leftColClasses = 'col-12 col-lg-8 col-md-6 col-sm-12',
    rightColClasses = 'col-12 col-lg-4 col-md-6 col-sm-12',
    leftDivClasses = 'homepage-left-div d-flex flex-column common-page-div',
    rightDivClasses = 'homepage-right-div d-flex flex-column',
    containerFluid = true,
    showCopyright = true,
    copyrightText = `Copyright © ${currentYear}, Steven Willand Inc.`,
  } = options;

  return (props) => {
    return (
      <div className={containerFluid ? 'container-fluid' : ''}>
        <div className="container">
          <div className="row">
            {/* Left Column */}
            <div className={`${leftColClasses} ${leftDivClasses}`}>
              <div className="flex-grow-1">
                <LeftComponent {...props} />
                {showCopyright && (
                  <div className="copyright-section">
                    <p className="copyright-text ">{copyrightText}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            {RightComponent && (
              <div className={`${rightColClasses} ${rightDivClasses}`}>
                <div className="flex-grow-1">
                  <RightComponent {...props} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
};

export default withTwoColumnLayout;
