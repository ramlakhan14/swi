import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import UserLoginPage from './Pages/UserLoginPage';
import AdminLoginPage from './Pages/AdminLoginPage';
import ForgotPassword from './Pages/ForgotPassword';
import Dashboard from './Pages/Dashboard';
import News from './Pages/News';
import FilePage from './Pages/Files';
import UserPage from './Pages/UserPage';
import UploadDealerListPage from './Pages/UploadDealerListPage';
import AlertPage from './Pages/AlertPage';
import SalesForcePage from './Pages/SalesForcePage';
import SavedEmailPage from './Pages/SavedEmailPage';
import ManageEmailPage from './Pages/ManageEmailPage';
import ProductLinePage from './Pages/ProductLinePage';
import EmailDealerPage from './Pages/EmailDealersPage';
import UserList from './Pages/UserList';
import DownloadDealerListPage from './Pages/DownloadDealerListPage';
import IndividualUserPage from './Pages/IndividualUserPage';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import NotFound from './Pages/NotFound';
import RebateFormPage from './Pages/RebateFormPage';
import ResetPassword from './Pages/ResetPassword';
import { useUser } from './context/UserContext';
import VerificationFileUploadPage from './Pages/VerificationFileUploadPage';
import RebateFormDataDownloadPage from './Pages/RebateFormDataDownloadPage';
import RebateFormPageUser from './Pages/RebateFormPageUser';
import RebateApprovalPage from './Pages/RebateApprovalPage';
import RebateApprovalTablePage from './Pages/RebateApprovalTablePage';
import ClaimFormFormPage from './Pages/ClaimFormFormPage';
import ProductLineEditPage from './Pages/ProductLineEditPage';
import ClaimFormDataDownloadPage from './Pages/ClaimFormDataDownloadPage';
import UploadClaimVerificationSheetPage from './Pages/UploadClaimVerificationSheetPage';
import ClaimFormFormPageAdmin from './Pages/ClaimFormFormPageAdmin';
import DealerRebateFormDataDownloadPage from './Pages/DealerRebateFormDataDownloadPage';
import DealerUserRebateFormDataDownloadPage from './Pages/DealerUserRebateFormDataDownloadPage';
const AppContent = () => {
  const { user } = useUser();
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <UserLoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login-admin"
          element={
            <PublicRoute>
              <AdminLoginPage />
            </PublicRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path={user?.role_id === 1 ? '/new' : '/'} element={<News />} />
        <Route
          path={user?.role_id === 1 ? '/file' : '/'}
          element={<FilePage />}
        />
        <Route
          path={user?.role_id === 1 ? '/user' : '/'}
          element={<UserPage />}
        />
        <Route
          path={user?.role_id === 1 ? '/upload-dealer-list' : '/'}
          element={<UploadDealerListPage />}
        />
        <Route
          path={user?.role_id === 1 ? '/alert' : '/'}
          element={<AlertPage />}
        />
        <Route
          path={user?.role_id === 1 ? '/sales-force' : '/'}
          element={<SalesForcePage />}
        />
        <Route
          path={user?.role_id === 1 ? '/saved-email' : '/'}
          element={<SavedEmailPage />}
        />
        <Route
          path={user?.role_id === 1 ? '/manage-email' : '/'}
          element={<ManageEmailPage />}
        />
        <Route
          path={user?.role_id === 1 ? '/product-line' : '/'}
          element={<ProductLinePage />}
        />
        <Route
          path={user?.role_id === 1 ? '/email-dealer' : '/'}
          element={<EmailDealerPage />}
        />
        <Route
          path={user?.role_id === 1 ? '/email-dealer/:id' : '/'}
          element={<EmailDealerPage />}
        />
        <Route
          path={user?.role_id === 1 ? '/download-dealer-list' : '/'}
          element={<DownloadDealerListPage />}
        />
        <Route
          path={user?.role_id === 1 ? '/product-line-edit-content/:id' : '/'}
          element={<ProductLineEditPage />}
        />
        <Route
          path={user?.role_id === 1 ? '/individual-user/:id' : '/'}
          element={<IndividualUserPage />}
        />
        <Route
          path={user?.role_id === 1 ? '/verification-file-upload' : '/'}
          element={<VerificationFileUploadPage />}
        />
        <Route
          path={user?.role_id === 1 ? '/rebate-form-data-download' : '/'}
          element={<RebateFormDataDownloadPage />}
        />
        <Route
          path={user?.role_id === 1 ? '/claim-form-data-download' : '/'}
          element={<ClaimFormDataDownloadPage />}
        />
        <Route
          path={user?.role_id === 1 ? '/upload-claim-verification-sheet' : '/'}
          element={<UploadClaimVerificationSheetPage />}
        />
        <Route
          path={user?.role_id === 1 ? '/rebate-approval' : '/'}
          element={<RebateApprovalPage />}
        />
        <Route
          path={user?.role_id === 1 ? '/rebate-approval/:id' : '/'}
          element={<RebateApprovalTablePage />}
        />
        <Route
          path="/claim-form"
          element={
            user?.role_id === 1 ? (
              <ClaimFormFormPageAdmin />
            ) : (
              <ClaimFormFormPage />
            )
          }
        />
        <Route
          path="/rebate-form"
          element={
            user?.role_id === 1 ? <RebateFormPageUser /> : <RebateFormPage />
          }
        />
        <Route
          path={user?.role_id !== 1 ? '/user-list' : '/'}
          element={<UserList />}
        />
        <Route
          path={user?.role_id === 2 ? '/rebate-form-data-download' : '/'}
          element={<DealerRebateFormDataDownloadPage />}
        />
        <Route
          path={user?.roles_id === 3 ? '/rebate-form-data-download' : '/'}
          element={<DealerUserRebateFormDataDownloadPage />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
