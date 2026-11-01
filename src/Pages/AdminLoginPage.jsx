import React from 'react';
import phoneIcon from "../assets/icons/ic-phone.png";
import emailIcon from "../assets/icons/ic-email.png"
import AdminLoginFrom from '../components/AdminLoginFrom';
import HelmetComponent from '../components/HelmetComponent';
import bgImg from "../assets/icons/login.png"

export default function AdminLoginPage() {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <HelmetComponent
        title="Dealer Toolbox Admin Login | SWI"
        description="This is the description for the Dealer Toolbox Admin Login page."
        keywords="react, helmet, seo"
        canonicalUrl="login-admin"
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
               <div className='left-side-div flex-grow-1'>
                <img src={bgImg} alt='baner-img' loading="lazy" width={"100%"} height={"auto"} />
                <p className='copyright-text admin-login-page' style={{paddingTop:"20px"}}>Copyright © {currentYear}, Steven Willand Inc.</p>
              </div>
            </div>
            <div className="col-12 col-lg-6 col-md-6 col-sm-12 p-0 d-flex flex-column order-1 order-md-2" >
              <div className="right-side-div flex-grow-1 admin-login">
                <AdminLoginFrom />
                <div>
                  <p className='login-paragraph'>If you do not know your dealer ID number, please call or email us.</p>
                  <div className='d-flex align-items-center' style={{ paddingBottom: "12px" }}>
                    <img src={phoneIcon} width={"24px"} height={"24px"} alt='phone-icon' loading="lazy"/>
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