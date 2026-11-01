import React, { useEffect } from 'react';
import Topbar from './Topbar';
import MarqueeSection from './MarqueeSection';
import { useLocation } from 'react-router-dom';
import { getAlert } from '../services/adminApi';
import { useUser } from '../context/UserContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user } = useUser();
  const [isAlertData, setIsAlertData] = React.useState(null);

  useEffect(() => {
    const fetchAlertData = async () => {
      try {
        const response = await getAlert();
        setIsAlertData(response?.data?.alert_message);
      } catch (error) {
        setIsAlertData(null)
      }
    }

    if (location.pathname === '/login' || (location.pathname === '/' && user?.role_id !== 1)) {
      fetchAlertData();
    }
  }, [location, user]);

  
  return (
    <div>
      {(location.pathname === '/login' || (location.pathname === '/') && user?.role_id !== 1) && <MarqueeSection isAlertData={isAlertData} />}
      <Topbar />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;