import React, { useState, useRef, useEffect } from 'react';
import DownArrowIcon from "../assets/icons/ic-down.png"
import { showErrorToast, showInfoToast } from '../utils/ToastUtils';

export default function ActionApprovedDropdown({ activeButton, selectedRows, onApiCall }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApproved = () => {
    if (selectedRows?.length === 0) {
      showErrorToast("Please select at least one row to approve.");
      setIsOpen(false);
      return;
    }
    setIsOpen(false);
    activeButton(true);
    onApiCall?.('approved', selectedRows);
  };

  const handleUnapproved = () => {
    if (selectedRows?.length === 0) {
      showErrorToast("Please select at least one row to unapprove.");
      setIsOpen(false);
      return;
    }
    activeButton(false);
    setIsOpen(false);
    onApiCall?.('unapproved', selectedRows);
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        className="btn btn-light action-Btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        Action
        <img src={DownArrowIcon} alt="Down Arrow Icon" width={"16px"} height={"16px"} loading="lazy" style={{ marginLeft: "12px" }} />
      </button>

      {isOpen && (
        <div className="position-absolute shadow-lg custom-dropdown-action-btn">
          <button
            className="dropdown-item-custom"
            onClick={handleApproved}
            style={{ borderBottom: "1px solid #F4F4F5" }}
          >
            <span className='active-dot'></span>
            <span>Approve</span>
          </button>
          <button
            className="dropdown-item-custom"
            onClick={handleUnapproved}
          >
            <span className='in-active-dot'></span>
            <span>Reject</span>
          </button>
        </div>
      )}
    </div>
  );
}