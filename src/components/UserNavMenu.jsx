import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RebateFormDataDownload from '../assets/icons/ic-forum.png';
const UserNavMenu = () => {
  const navigate = useNavigate();
  const navItems = [
    {
      icon: (
        <img
          src={RebateFormDataDownload}
          alt="file-Icon"
          width={'16px'}
          height={'16px'}
          loading="lazy"
        />
      ),
      text: 'Rebate Form Data Download',
      link: '/rebate-form-data-download',
    },
  ];

  return (
    <div className="navmenu-div">
      <div className="d-flex flex-wrap" style={{ gap: '12px' }}>
        {navItems.map((item, index) => (
          <button
            key={index}
            className={`navmenu-div-btn ${
              item.text.includes('Claim Verification')
                ? 'green-btn-swi-edi'
                : ''
            }`}
            onClick={() => {
              if (item.link.startsWith('http')) {
                window.open(item.link, '_blank');
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

export default UserNavMenu;
