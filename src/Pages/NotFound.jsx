import React from "react";
import HelmetComponent from "../components/HelmetComponent";
import image from "../assets/images/404.png";

const NotFound = () => {
    const currentYear = new Date().getFullYear();
    return (
        <>
            <HelmetComponent
                title="404 | SWI"
                description="This is the description for the 404 page."
                keywords="react, helmet, seo"
                canonicalUrl=""
                customMeta={[
                    { name: "robots", content: "index, follow" },
                    { name: "author", content: "Ritik Jain" },
                    { property: "og:title", content: "404 | SWI" }
                ]}
            />
            <div className="container-fluid">
                <div className="container">
                    <div className="row">
                        <div className="col-12  homepage-left-div common-page-div position-relative" style={{ borderRadius: "12px" }}>
                            <div className="non-title-div">
                                <img src={image} alt="404 Not Found" style={{ maxWidth: "496px", marginBottom: "20px" }} />
                                <h1 className="not-found-heading">Ops, page not found</h1>
                                <button
                                    type="button"
                                    className="btn btn-success green-btn swi-edi-login-btn"
                                    style={{ fontSize: "12px", fontWeight: "700" }}
                                    onClick={() => window.location.href = "/"}
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                            
                           
                            <p className='copyright-text position-absolute bottom-0'>Copyright © {currentYear}, Steven Willand Inc.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFound;
