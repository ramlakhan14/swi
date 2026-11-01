import React, { useState } from 'react';
import InnerPageTopBar from './InnerPageTopBar';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtils';
import HelmetComponent from './HelmetComponent';

const DownloadDealerListContent = () => {
    const fetchGetAllFiles = async () => {
        try {
            const link = document.createElement("a");
            link.href = `${import.meta.env.VITE_API_BASE_URL}/admin/export-dealer`;
            link.download = `DealerExport_${new Date().toISOString().split("T")[0]}.xlsx`;
            link.target = "_blank";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showSuccessToast("File downloaded successfully! ✅");
        } catch (error) {
            showErrorToast("Failed to download file. Please refresh and try again.");
        }
    };

    return (
        <>
            <HelmetComponent
                title="Download Dealer List | SWI"
                description="This is the description for the download dealer list page."
                keywords="react, helmet, seo"
                canonicalUrl=""
                customMeta={[
                    { name: "robots", content: "index, follow" },
                    { name: "author", content: "Ritik Jain" },
                    { property: "og:title", content: "My React App" }
                ]}
            />
            <InnerPageTopBar />
            <div className="name-part" style={{ marginTop: "20px" }}>
                <h2>Download Dealer List</h2>
                <hr style={{ borderColor: "#E4E4E7", margin: "20px 0", opacity: "1" }} />
            </div>
            {/* <div>
                <p className='new-paragraph mb-3'>Click the Create File button to create the dealer list as a .CSV format file.</p>
                <button
                    type="button"
                    className="btn btn-dark black-btn-hover-white"
                    style={{ fontSize: "12px", fontWeight: "700" }}
                >
                    Create File</button>
                <hr style={{ borderColor: "#E4E4E7", margin: "20px 0", opacity: "1" }} />
            </div> */}

            <div>
                <p className='new-paragraph mb-3'>Click the Export Power Dealers button to create a data file of RedMax Power Dealers</p>
                <button
                    type="button"
                    className="btn btn-dark black-btn-hover-white"
                    style={{ fontSize: "12px", fontWeight: "700", padding: "12px 24px" }}
                    onClick={fetchGetAllFiles}
                >
                    Export Power Dealers</button>
                {/* <hr style={{ borderColor: "#E4E4E7", margin: "20px 0", opacity: "1" }} /> */}
            </div>
        </>
    );
};

export default DownloadDealerListContent;