import React, { useState } from 'react';
import InnerPageTopBar from './InnerPageTopBar';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtils';
import HelmetComponent from './HelmetComponent';

const ClaimFormDataDownloadContent = () => {
    const fetchGetAllFiles = async () => {
        try {
            const link = document.createElement("a");
            link.href = `${import.meta.env.VITE_API_BASE_URL}/admin/export-claim-data`;
            link.download = `claim_data_${new Date().toISOString().split("T")[0]}.xlsx`;
            link.target = "_blank";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showSuccessToast("File downloaded successfully!");
        } catch (error) {
            showErrorToast("Failed to download file. Please refresh and try again.");
        }
    };

    return (
        <>
            <HelmetComponent
                title="Download Claim Verification Sheet | SWI"
                description="This is the description for the download claim verification sheet page."
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
                <h2>Download Claim Verification Sheet</h2>
                <hr style={{ borderColor: "#E4E4E7", margin: "20px 0", opacity: "1" }} />
            </div>

            <div>
                <p className='new-paragraph mb-3'>This will fetch the data which user has submitted using the claim verification sheet. Provide the download data in CSV or Excel.</p>
                <button
                    type="button"
                    className="btn btn-dark black-btn-hover-white"
                    style={{ fontSize: "12px", fontWeight: "700" , padding: "12px 24px" }}
                    onClick={fetchGetAllFiles}
                >Export Claim Sheet</button>
            </div>
        </>
    );
};

export default ClaimFormDataDownloadContent;