import React from 'react';
import QuickLinks from './QuickLinks';
import SupportButton from './SupportButton';

const RightContent = () => {
  const quickLinksData = [
    { label: "Files", url: "/file" },
    { label: "News", url: "/new" },
    { label: "Product Line", url: "/product-line" },
    { label: "Users", url: "/user" },
    // { label: "Dealer Locator", url: "#" },
    { label: "Alerts", url: "/alert" },
    { label: "Sales Force", url: "/sales-force" },
    { label: "Upload Dealer List", url: "/upload-dealer-list" },
    { label: "Download Dealer List", url: "/download-dealer-list" },
    { label: "E-mail Dealers", url: "/email-dealer" },
    { label: "Saved E-mail", url: "/saved-email" },
    { label: "Manage Email", url: "/manage-email" },
    { label: "Rebate Verification file upload", url: "/verification-file-upload" },
    { label: "Rebate Form Data Download", url: "/rebate-form-data-download" },
    { label: "Rebate Approval", url: "/rebate-approval" },
    { label: "Upload Claim Verification Sheet", url: "/upload-claim-verification-sheet" },
    { label: "Download Claim Verification Sheet", url: "/claim-form-data-download" }
  ];

  return (
    <>
      <QuickLinks title="Admin Quick Links" links={quickLinksData} />
      <SupportButton title="Action" />
    </>
  );
};

export default RightContent;