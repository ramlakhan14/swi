import React, { useState } from "react";
import fileIcon from "../assets/icons/ic-files.png";
import newIcon from "../assets/icons/ic-news.png";
import productIcon from "../assets/icons/ic-product.png";
import accountIcon from "../assets/icons/ic-account.png";
import locateIcon from "../assets/icons/ic-locate.png";
import alertIcon from "../assets/icons/ic-alert.png";
import emailIcon from "../assets/icons/ic-email-green.png";
import UploadDealerList from "../assets/icons/ic-upload.png";
import DownloadDealerList from "../assets/icons/ic-download.png";
import VerificationFileUpload from "../assets/icons/ic-verification.png";
import RebateFormDataDownload from "../assets/icons/ic-forum.png";
import { useNavigate } from "react-router-dom";
import rebateApprovalIcon from "../assets/icons/ic-check-square.png";
import verificationSheetIcon from "../assets/icons/ic-download_file.png";
import uploadVerificationSheetIcon from "../assets/icons/ic-upload_file.png";

const NavMenu = () => {
  const navigate = useNavigate();
  const navItems = [
    {
      icon: (
        <img
          src={fileIcon}
          alt="file-Icon"
          width={"16px"}
          height={"16px"}
          loading="lazy"
        />
      ),
      text: "Files",
      link: "/file",
    },
    {
      icon: (
        <img
          src={newIcon}
          alt="file-Icon"
          width={"16px"}
          height={"16px"}
          loading="lazy"
        />
      ),
      text: "News",
      link: "/new",
    },
    {
      icon: (
        <img
          src={productIcon}
          alt="file-Icon"
          width={"16px"}
          height={"16px"}
          loading="lazy"
        />
      ),
      text: "Product Line",
      link: "/product-line",
    },
    {
      icon: (
        <img
          src={accountIcon}
          alt="file-Icon"
          width={"16px"}
          height={"16px"}
          loading="lazy"
        />
      ),
      text: "Users",
      link: "/user",
    },
    // { icon: <img src={locateIcon} alt='file-Icon' width={"16px"} height={"16px"} loading="lazy" />, text: 'Dealer Locator', link: "https://dealers.stevenwillandinc.com/dealer-locator/" },
    {
      icon: (
        <img
          src={alertIcon}
          alt="file-Icon"
          width={"16px"}
          height={"16px"}
          loading="lazy"
        />
      ),
      text: "Alerts",
      link: "/alert",
    },
    {
      icon: (
        <img
          src={accountIcon}
          alt="file-Icon"
          width={"16px"}
          height={"16px"}
          loading="lazy"
        />
      ),
      text: "Sales Force",
      link: "/sales-force",
    },
    {
      icon: (
        <img
          src={UploadDealerList}
          alt="file-Icon"
          width={"16px"}
          height={"16px"}
          loading="lazy"
        />
      ),
      text: "Upload Dealer List",
      link: "/upload-dealer-list",
    },
    {
      icon: (
        <img
          src={DownloadDealerList}
          alt="file-Icon"
          width={"16px"}
          height={"16px"}
          loading="lazy"
        />
      ),
      text: "Download Dealer List",
      link: "/download-dealer-list",
    },
    {
      icon: (
        <img
          src={emailIcon}
          alt="file-Icon"
          width={"16px"}
          height={"16px"}
          loading="lazy"
        />
      ),
      text: "E-mail Dealers",
      link: "/email-dealer",
    },
    {
      icon: (
        <img
          src={emailIcon}
          alt="file-Icon"
          width={"16px"}
          height={"16px"}
          loading="lazy"
        />
      ),
      text: "Saved E-mail",
      link: "/saved-email",
    },
    {
      icon: (
        <img
          src={emailIcon}
          alt="file-Icon"
          width={"16px"}
          height={"16px"}
          loading="lazy"
        />
      ),
      text: "Manage Email",
      link: "/manage-email",
    },
    {
      icon: (
        <img
          src={VerificationFileUpload}
          alt="file-Icon"
          width={"16px"}
          height={"16px"}
          loading="lazy"
        />
      ),
      text: "Rebate Verification file upload",
      link: "/verification-file-upload",
    },
    {
      icon: (
        <img
          src={RebateFormDataDownload}
          alt="file-Icon"
          width={"16px"}
          height={"16px"}
          loading="lazy"
        />
      ),
      text: "Rebate Form Data Download",
      link: "/rebate-form-data-download",
    },
    {
      icon: (
        <img
          src={rebateApprovalIcon}
          alt="file-Icon"
          width={"16px"}
          height={"16px"}
          loading="lazy"
        />
      ),
      text: "Rebate Approval",
      link: "/rebate-approval",
    },
    {
      icon: (
        <img
          src={uploadVerificationSheetIcon}
          alt="file-Icon"
          width={"16px"}
          height={"16px"}
          loading="lazy"
        />
      ),
      text: "Upload Claim Verification Sheet",
      link: "/upload-claim-verification-sheet",
    },
    {
      icon: (
        <img
          src={verificationSheetIcon}
          alt="file-Icon"
          width={"16px"}
          height={"16px"}
          loading="lazy"
        />
      ),
      text: "Download Claim Verification Sheet",
      link: "/claim-form-data-download",
    },
  ];

  return (
    <div className="navmenu-div">
      <div className="d-flex flex-wrap" style={{ gap: "12px" }}>
        {navItems.map((item, index) => (
          <button
            key={index}
            className={`navmenu-div-btn ${item.text.includes("Claim Verification") ? "green-btn-swi-edi" : ""}`}
            onClick={() => {
              if (item.link.startsWith("http")) {
                window.open(item.link, "_blank");
              } else {
                navigate(item.link);
              }
            }}
          >
            <span className="me-2">{item.icon}</span>
            <span className="navmenu-div-btn-text">{item.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavMenu;
