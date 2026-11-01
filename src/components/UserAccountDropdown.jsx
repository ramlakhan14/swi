import React, { useState, useRef, useEffect } from 'react';
import userIcon from '../assets/icons/ic-user.png';
import logoutIcon from '../assets/icons/ic-logout.png';
import passwordIcon from '../assets/icons/ic-password.png';
import accountIcon from '../assets/icons/ic-account.png';
import ChangePassword from './Modal/ChangePassword';
import { useNavigate } from 'react-router-dom';
import Logout from './Modal/Logout';
import { useUser } from '../context/UserContext';

export default function UserAccountDropdown() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenChangePassword, setIsChangePassword] = useState(false);
  const [isLogOutOpen, setIsLogOutOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleManageAccount = () => {
    navigate('/user-list');
    setIsOpen(false);
  };

  const handleChangePassword = () => {
    setIsOpen(false);
    setIsChangePassword(true);
  };

  const handleLogout = () => {
    setIsLogOutOpen(true);
    setIsOpen(false);
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button className="btn border-0 p-0" onClick={() => setIsOpen(!isOpen)}>
        <img
          src={userIcon}
          alt="user-icon"
          className="user-icon"
          loading="lazy"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="position-absolute shadow-lg custom-dropdown">
          {user?.role_id === 2 && (
            <button
              className="dropdown-item-custom"
              onClick={handleManageAccount}
              style={{ borderBottom: '1px solid #F4F4F5' }}
            >
              <img
                src={accountIcon}
                alt="user-icon"
                loading="lazy"
                height={'24px'}
                width={'24px'}
              />
              <span>Manage Account</span>
            </button>
          )}
          <button
            className="dropdown-item-custom"
            onClick={handleChangePassword}
            style={{ borderBottom: '1px solid #F4F4F5' }}
          >
            <img
              src={passwordIcon}
              alt="user-icon"
              loading="lazy"
              height={'24px'}
              width={'24px'}
            />
            <span>Change Password</span>
          </button>
          <button className="dropdown-item-custom" onClick={handleLogout}>
            <img
              src={logoutIcon}
              alt="user-icon"
              loading="lazy"
              height={'24px'}
              width={'24px'}
            />
            <span>Logout</span>
          </button>
        </div>
      )}
      <ChangePassword
        isOpen={isOpenChangePassword}
        onClose={() => setIsChangePassword(false)}
      />
      <Logout
        isOpen={isLogOutOpen}
        onClose={() => setIsLogOutOpen(false)}
        data={user}
      />
    </div>
  );
}
