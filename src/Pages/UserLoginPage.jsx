import React from 'react';
import phoneIcon from "../assets/icons/ic-phone.png";
import emailIcon from "../assets/icons/ic-email.png"
import UserLogin from '../components/UserLoginForm';
import HelmetComponent from '../components/HelmetComponent';
import { useNavigate } from 'react-router-dom';


export default function UserLoginPage() {
  const currentYear = new Date().getFullYear();
 const handleButtonClick = () => {
  window.open("https://www.swiedi.com/willand/b2b.html", "_blank");
};
  return (
    <>
      <HelmetComponent
        title="Dealer Toolbox Login | SWI"
        description="This is the description for the Dealer Toolbox Login page."
        keywords="react, helmet, seo"
        canonicalUrl="login"
        customMeta={[
          { name: "robots", content: "index, follow" },
          { name: "author", content: "Ritik Jain" },
          { property: "og:title", content: "My React App" }
        ]}
      />

      <div className="container-fluid" style={{ paddingBottom: "20px" }}>
        <div className="container">
          <div className="row outer-div">
            <div className="col-12 col-lg-6 col-md-6 col-sm-12 p-0 d-flex flex-column order-2 order-md-1">
              <div className='left-side-div flex-grow-1 user-login'>
                <div style={{ margin: "auto 0" }}>
                  <p className='login-hedding pb-0 mb-0'>Online Ordering &</p>
                  <p className='login-hedding pb-0 mb-0'>Account Management System</p>
                  <div className='swi-edi-div'>
                    <button type="button" className="btn btn-light white-btn"  onClick={handleButtonClick}>SWI - EDI</button>
                    <a
                      href="https://www.swiedi.com/willand/b2b.html"
                      className="links-text"
                      role='button'
                       target="_blank"
                    >
                      https://www.swiedi.com/willand/b2b.html
                    </a>

                  </div>
                </div>
                <div>
                  <p className='copyright-text mb-0'>Copyright © {currentYear}, Steven Willand Inc.</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6 col-md-6 col-sm-12 p-0 d-flex flex-column order-1 order-md-2" >
              <div className="right-side-div flex-grow-1 admin-login">
                <UserLogin />
                <div>
                  <p className='login-paragraph'>If you do not know your dealer ID number, please call or email us.</p>
                  <div className='d-flex align-items-center' style={{ paddingBottom: "12px" }}>
                    <img src={phoneIcon} width={"24px"} height={"24px"} alt='phone-icon' loading="lazy" />
                    <a href="tel:1-888-229-4561" className="links-text">1-888-229-4561</a>
                  </div>
                  <div className='d-flex align-items-center'>
                    <img src={emailIcon} width={"24px"} height={"24px"} alt='email-icon' loading="lazy" />
                    <a href="mailto:info@stevenwillandinc.com" className="links-text">info@stevenwillandinc.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}