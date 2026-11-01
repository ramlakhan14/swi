import React, { useState, useEffect } from 'react';
import LogoImg from "../assets/logo.png";
import faceBook from "../assets/icons/ic-facebook.png";
import twitter from "../assets/icons/ic-x.png";
import instagram from "../assets/icons/ic-instagram.png";
import youtube from "../assets/icons/ic-youtube.png";
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Topbar = () => {
    const { user } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAbove1024, setIsAbove1024] = useState(window.innerWidth > 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsAbove1024(window.innerWidth > 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <nav className="topbar-wrapper container-fluid">
                <div className="container topbar-container">
                    <div className="my-flex-box">
                        {/* Brand Section */}
                        <div className="brand-section justify-content-between">
                            <div className="logo-box">
                                <img src={LogoImg} alt='logo img' height={"48px"} width={"170px"} loading="lazy" />
                                <p className="brand-subtext">Quality Distribution</p>
                            </div>
                            {/* Mobile Toggle */}
                            {!isAbove1024 && (
                                <button
                                    className="mobile-toggle"
                                    onClick={toggleMenu}
                                    aria-label="Toggle menu"
                                >
                                    ☰
                                </button>
                            )}
                        </div>

                        {/* Right Section: Social Icons + Navigation */}
                        <div className="right-section">
                            {/* Social Icons - Desktop Only */}
                            {isAbove1024 && (
                                <div className="d-flex align-items-center justify-content-end gap-3" style={{ marginBottom: "20px" }}>
                                    <div className="social-icons">
                                        <a href="https://www.facebook.com/StevenWillandInc" target="_blank" rel="noopener noreferrer">
                                            <button type="button" className="btn btn-dark black-btn">
                                                <img src={faceBook} alt='facebook' width="24px" height="24px" loading="lazy" />
                                            </button>
                                        </a>

                                        <a href="https://twitter.com/SWI1966" target="_blank" rel="noopener noreferrer">
                                            <button type="button" className="btn btn-dark black-btn">
                                                <img src={twitter} alt='Twitter' width="24px" height="24px" loading="lazy" />
                                            </button>
                                        </a>

                                        <a href="https://instagram.com/stevenwillandinc" target="_blank" rel="noopener noreferrer">
                                            <button type="button" className="btn btn-dark black-btn">
                                                <img src={instagram} alt='Instagram' width="24px" height="24px" loading="lazy" />
                                            </button>
                                        </a>

                                        <a href="https://www.youtube.com/user/stevenwillandinctube" target="_blank" rel="noopener noreferrer">
                                            <button type="button" className="btn btn-dark black-btn">
                                                <img src={youtube} alt='YouTube' width="24px" height="24px" loading="lazy" />
                                            </button>
                                        </a>

                                    </div>
                                </div>
                            )}

                            {/* Navigation Menu */}
                            <ul className={`nav-menu ${isMenuOpen ? 'show' : ''}`}>
                                <li><a href="http://swi-distribution.com" rel="noopener noreferrer" className="nav-link-custom">Home</a></li>
                                <li><a href="http://www.swi-distribution.com/products/" rel="noopener noreferrer" className="nav-link-custom">Product Sources</a></li>
                                <li><a href="https://territory.stevenwillandinc.com/sales-territories/" rel="noopener noreferrer" className="nav-link-custom">Sales Territories</a></li>
                                <li><a href="http://www.swi-distribution.com/contact-us/" rel="noopener noreferrer" className="nav-link-custom">Contact Us</a></li>
                                {/* <li><a href="https://dealers.stevenwillandinc.com/dealer-locator/" rel="noopener noreferrer" className="nav-link-custom">Dealer Locator</a></li> */}
                                <li><Link to={user ? "/" : "/login-admin"} className="nav-link-custom">Dealer Toolbox</Link></li>
                            </ul>

                            {/* Social Icons - Mobile/Tablet Only */}
                            {!isAbove1024 && (
                                <div className={`social-icons-mobile ${isMenuOpen ? 'show' : ''}`}>
                                    <div className="social-icons d-flex align-items-center justify-content-center gap-3">
                                        <button type="button" className="btn btn-dark black-btn">
                                            <img src={faceBook} alt='facebook' width={"24px"} height={"24px"} loading="lazy" />
                                        </button>
                                        <button type="button" className="btn btn-dark black-btn">
                                            <img src={twitter} alt='Twitter' width={"24px"} height={"24px"} loading="lazy" />
                                        </button>
                                        <button type="button" className="btn btn-dark black-btn">
                                            <img src={instagram} alt='Instagram' width={"24px"} height={"24px"} loading="lazy" />
                                        </button>
                                        <button type="button" className="btn btn-dark black-btn">
                                            <img src={youtube} alt='YouTube' width={"24px"} height={"24px"} loading="lazy" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Topbar;