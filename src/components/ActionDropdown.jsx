import React, { useState, useRef, useEffect } from 'react';
import deleteIcon from "../assets/icons/ic-trash.png";
import DownArrowIcon from "../assets/icons/ic-down.png"
import { useLocation } from 'react-router-dom';

export default function ActionDropdown({deleteModal , activeButton , selectedRows}) {  
  const location = useLocation();
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

  const handleActive = () => {
    setIsOpen(false);
    activeButton(true);
  };

  const handleInActive = () => {
    activeButton(false);
    setIsOpen(false);
  };

  const handleDelete = () => {
    setIsOpen(false);
    deleteModal(true);
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
        <button
          className="btn btn-light action-Btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          Action
          <img src={DownArrowIcon} alt="Down Arrow Icon" width={"16px"} height={"16px"} loading="lazy" style={{marginLeft:"12px"}} />
        </button>

        {isOpen && (
          <div
            className="position-absolute shadow-lg custom-dropdown-action-btn"
          >
           {location.pathname !== '/saved-email' && <><button
              className="dropdown-item-custom"
              onClick={handleActive}
              disabled={!selectedRows?.length}
              style={{borderBottom:"1px solid #F4F4F5"}}
            >
              <span className='active-dot'></span>
              <span>Active</span>
            </button>
            <button
              className="dropdown-item-custom"
              onClick={handleInActive}
              disabled={selectedRows.length === 0}
              style={{borderBottom:"1px solid #F4F4F5"}}
            >
              <span className='in-active-dot'></span>
              <span>In-Active</span>
            </button></>}
            <button
              className="dropdown-item-custom"
              onClick={handleDelete}
            >
              <img src={deleteIcon} alt="delete-Icon" loading="lazy" height={"24px"} width={"24px"}/>
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
  );
}