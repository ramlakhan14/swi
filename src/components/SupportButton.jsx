import { useState } from 'react';
import SupportPopup from './SupportPopup';
import { useUser } from '../context/UserContext';
import ichat from '../assets/icons/ic-chat.svg';

const SupportButton = ({title = ""}) => {
  const { user } = useUser();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Only show for admin (role_id === 1)
  if (user?.role_id !== 1) {
    return null;
  }

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="downloads-div mb-3">
      <div className='formHeadingWrapper-flex'>
        <p className='formHeading-flex'>{title}</p>
        <div className='line'></div>
      </div>
      <button
        type="button"
        className="btn btn-dark black-btn-hover-white fw-semibold d-flex align-items-center gap-2"
        onClick={handleOpenPopup}
        style={{
            marginRight: "12px",
            marginTop: "10px",
            marginBottom: "10px",
            padding: "8px 18px",
            borderRadius: "10px",
        }}
      >
        <img
            src={ichat}
            alt="Help"
            style={{
            width: "18px",
            height: "18px",
            objectFit: "contain",
            }}
        />
        <span>Help</span>
      </button>
      {isPopupOpen && (
        <SupportPopup onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default SupportButton;