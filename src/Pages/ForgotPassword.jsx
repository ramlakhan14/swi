import React from 'react';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import { useNavigate } from 'react-router-dom';
import HelmetComponent from '../components/HelmetComponent';
import bgImg from "../assets/icons/login.png"

export default function ForgotPassword() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  return (
    <>
      <HelmetComponent
        title="Dealer Toolbox Forgot Password | SWI"
        description="This is the description for the Dealer Toolbox Forgot Password page."
        keywords="react, helmet, seo"
        canonicalUrl="forgot-password"
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
                 <img src={bgImg} alt='baner-img' loading="lazy" width={"100%"} height={"auto"}  />
                <p className='admin-login-page' style={{paddingTop:"20px"}}>Copyright © {currentYear}, Steven Willand Inc.</p>
              </div>
            </div>
            <div className="col-12 col-lg-6 col-md-6 col-sm-12 p-0 d-flex flex-column order-1 order-md-2">
              <div className="right-side-div flex-grow-1 admin-login">
                <ForgotPasswordForm />
                <div>
                  <p className='login-paragraph mb-0 pb-0'>Remember your password?<span className='login-here' onClick={() => navigate('/login-admin')}>Login Here</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}