import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./global.scss";
import App from './App.jsx'
import { Toaster } from 'react-hot-toast';
import LoaderWrapper from './components/LoaderWrapper.jsx';
import { UserProvider } from './context/UserContext.jsx';

createRoot(document.getElementById('root')).render(<>
  {/* // <StrictMode> */}
  <UserProvider>
  {/* <Toaster position="bottom-center" toastOptions={{ duration: 4000 }} />, */}
  <Toaster position="bottom-center" toastOptions={{
    duration: 4000,
    style: {
      zIndex: 999999,
    },
  }}
  containerStyle={{
    zIndex: 999999,
    top: 20,
  }} />,
    <App />
    <LoaderWrapper />
  </UserProvider>,
  {/* // </StrictMode> */}
  
  </>,
)
