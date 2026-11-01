import NewSection from '../components/NewSection';
import BrandVerticalTabs from '../components/BrandVerticalTabs';
import NavMenu from '../components/NavMenu';
import UserAccountDropdown from '../components/UserAccountDropdown';
import HelmetComponent from '../components/HelmetComponent';
import { useEffect, useState } from 'react';
import { dashboardAdmin, getByIdAdminProduct } from '../services/adminApi';
import DownloadsLinks from '../components/DownloadsLinks';
import { showErrorToast } from '../utils/ToastUtils';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import PolicyAndProcedures from '../assets/pdf/2026 SWI Policies  Procedures Manual.pdf';
import SupportButton from '../components/SupportButton';
import UserNavMenu from '../components/UserNavMenu';
import DealerUserNavMenu from '../components/DealerUserNavMenu';

const Dashboard = () => {
  const { user } = useUser();
  console.log('Dashboard User:', user);
  console.log('Role ID:', user?.role_id);
  console.log('EDI ID:', user?.swidistinc_ediID);
  console.log('EDI Password:', user?.swidistinc_password);
  const navigate = useNavigate();
  const [isNewData, setIsNewData] = useState([]);
  const [isProductList, setIsProductList] = useState([]);
  const [isBandContent, setIsBandContent] = useState([]);
  const [isQuickLinksData, setIsQuickLinksData] = useState([]);
  const [isBandId, setIsBandId] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await dashboardAdmin();
        setIsNewData(response?.data?.main_product?.news);
        const mainDetail = response?.data?.main_product?.product;
        const relatedProducts = response?.data?.related_products || [];
        const productData = [mainDetail, ...relatedProducts];
        setIsQuickLinksData(response?.data?.main_product?.categories);
        response?.data?.main_product?.categories?.push(
          {
            id: 0,
            category_name: 'SWI Outlet',
            files: null,
            url: 'https://swioutletstore.com',
          },
          {
            id: -1,
            category_name: 'Policies & Procedures',
            files: null,
            url: PolicyAndProcedures, // add actual URL if available
          },
          {
            id: -2,
            category_name: 'Freight Policy',
            files: null,
            url: '', // add actual URL if available
          },
        );
        setIsProductList(productData);
        setIsBandContent(response?.data?.main_product?.product_details);
      } catch (error) {
        showErrorToast(
          'An error occurred while fetching the dashboard data. Please refresh and try again.',
        );
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchDataById = async () => {
      try {
        const response = await getByIdAdminProduct(isBandId);
        setIsNewData(response?.data?.news);
        setIsBandContent(response?.data?.product_details);
        setIsQuickLinksData(response?.data?.category);
      } catch (error) {
        showErrorToast(
          'An error occurred while fetching the dashboard data. Please refresh and try again.',
        );
      }
    };
    if (isBandId) {
      fetchDataById();
    }
  }, [isBandId]);

  return (
    <>
      <HelmetComponent
        title="Dashboard | SWI"
        description="This is the description for the Dashboard page."
        keywords="react, helmet, seo"
        canonicalUrl=""
        customMeta={[
          { name: 'robots', content: 'index, follow' },
          { name: 'author', content: 'Ritik Jain' },
          { property: 'og:title', content: 'My React App' },
        ]}
      />
      <div className="container-fluid">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-8 col-md-6 col-sm-12 homepage-left-div d-flex flex-column">
              <div className="flex-grow-1">
                <div className="dashboard-left-side-topbar d-flex justify-content-between shivqam">
                  <div className="name-part">
                    <h2>
                      {' '}
                      {user?.role_id !== 1
                        ? `Welcome, ${user?.first_name}${
                            user?.last_name ? ` ${user?.last_name}` : ''
                          }`
                        : 'Welcome, Administrator'}
                    </h2>
                  </div>
                  <div className="button-part d-flex">
                    {/* {user?.role_id === 1 || user?.role_id === 2 ? (
                    <> */}
                    {/* <button type="button" className="btn btn-dark green-btn swi-edi-login-btn" style={{ marginRight: "12px" }} onClick={() => navigate("/claim-form")}>Claim Form</button> */}
                    {user?.role_id === 1 || user?.role_id === 2 ? (
                      <button
                        type="button"
                        className="btn btn-dark green-btn swi-edi-login-btn"
                        style={{ marginRight: '12px' }}
                        onClick={() => navigate('/claim-form')}
                      >
                        Claim Form
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="btn btn-dark black-btn-hover-white fw-semibold"
                      onClick={() => navigate('/rebate-form')}
                    >
                      Bid/Fleet Form
                    </button>
                    {/* </>
                   ) : null} */}
                    <button
                      type="button"
                      className="btn btn-success green-btn swi-edi-login-btn"
                      onClick={() =>
                        (window.location.href =
                          'https://www.swiedi.com/willand/b2b.html')
                      }
                    >
                      SWI - EDI Login
                    </button>

                    {user?.role_id !== 1 &&
                      user?.swidistinc_ediID !== null &&
                      user?.swidistinc_password !== null && (
                        <button
                          type="button"
                          className="btn btn-dark green-btn swi-edi-login-btn"
                          style={{ marginRight: '12px' }}
                          onClick={() =>
                            window.open(
                              'https://www.swidistinc.com/login?userid=' +
                                user?.swidistinc_ediID +
                                '&userpass=' +
                                user?.swidistinc_password,
                              '_blank',
                            )
                          }
                        >
                          Import Order
                        </button>
                      )}
                    <UserAccountDropdown />
                  </div>
                </div>
                <div>
                  {user?.role_id === 1 && (
                    <div className="admin-top-bar">
                      <NavMenu />
                    </div>
                  )}

                  {user?.role_id === 2 && (
                    <div className="admin-top-bar">
                      <UserNavMenu />
                    </div>
                  )}

                  {user?.roles_id === 3 && (
                    <div className="admin-top-bar">
                      <DealerUserNavMenu />
                    </div>
                  )}

                  <BrandVerticalTabs
                    brands={isProductList}
                    contentData={isBandContent}
                    setIsBandId={setIsBandId}
                  />
                  <p className="copyright-text">
                    Copyright © {currentYear}, Steven Willand Inc.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-4 col-md-6 col-sm-12 homepage-right-div d-flex flex-column">
              <div className="flex-grow-1">
                <DownloadsLinks title="Downloads" links={isQuickLinksData} />
                <SupportButton title="Action" />
                <NewSection newsData={isNewData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
