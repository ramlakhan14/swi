import { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { submitSupportRequest } from '../services/adminApi';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtils';

const SupportPopup = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dealerId: '',
    message: '',
    screenshots: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const previewUrlsRef = useRef([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    previewUrlsRef.current = previewUrls;
  }, [previewUrls]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const addScreenshotToForm = (file) => {
    setFormData(prev => ({
      ...prev,
      screenshots: [...prev.screenshots, file]
    }));

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrls(prev => [...prev, objectUrl]);
  };

  const captureScreenshot = async (mode = 'visible') => {
    const toDataUrl = (text, width = 400, height = 120) => {
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
          <rect width="100%" height="100%" fill="#f3f4f6" />
          <rect x="20" y="20" width="${width - 40}" height="${height - 40}" rx="12" fill="#ffffff" stroke="#d1d5db" stroke-width="2" />
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#6b7280">${text}</text>
        </svg>
      `;

      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    };

    const isCrossOriginImage = (src) => {
      if (!src) {
        return false;
      }
      try {
        const url = new URL(src, window.location.href);
        return url.origin !== window.location.origin;
      } catch {
        return false;
      }
    };
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const popupOverlay = document.querySelector('.support-popup-overlay');
    const popupContent = document.querySelector('.support-popup-content');

    if (!popupOverlay || !popupContent) {
      return;
    }

    setIsCapturing(true);

    const originalScrollX = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
    const originalScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const originalOverlayDisplay = popupOverlay.style.display;
    const originalPopupDisplay = popupContent.style.display;
    const originalPopupVisibility = popupContent.style.visibility;

    try {
      popupOverlay.style.display = 'none';
      popupContent.style.display = 'none';

      await new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      });

      const fullWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, window.innerWidth);
      const fullHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, window.innerHeight);

      const width = mode === 'full' ? fullWidth : window.innerWidth;
      const height = mode === 'full' ? fullHeight : window.innerHeight;
      const x = mode === 'full' ? 0 : originalScrollX;
      const y = mode === 'full' ? 0 : originalScrollY;

      const imageToDataUrl = async (img) => {
        if (!img || !img.src) return null;
        if (img.src.startsWith('data:')) return img.src;

        // Try direct canvas draw from already rendered image
        try {
          if (img.complete && img.naturalWidth > 0) {
            const cvs = document.createElement('canvas');
            cvs.width = img.naturalWidth;
            cvs.height = img.naturalHeight;
            const ctx = cvs.getContext('2d');
            ctx.drawImage(img, 0, 0);
            return cvs.toDataURL('image/png');
          }
        } catch {
          // Canvas tainted
        }

        // Try loading via fresh Image object with crossOrigin anonymous
        try {
          const dataUrl = await new Promise((resolve) => {
            const tempImg = new Image();
            tempImg.crossOrigin = 'anonymous';
            tempImg.onload = () => {
              try {
                const cvs = document.createElement('canvas');
                cvs.width = tempImg.naturalWidth || tempImg.width;
                cvs.height = tempImg.naturalHeight || tempImg.height;
                const ctx = cvs.getContext('2d');
                ctx.drawImage(tempImg, 0, 0);
                resolve(cvs.toDataURL('image/png'));
              } catch {
                resolve(null);
              }
            };
            tempImg.onerror = () => resolve(null);
            tempImg.src = img.src;
          });
          if (dataUrl) return dataUrl;
        } catch {
          // Temp image failed
        }

        // Only attempt fetch if same origin or explicitly supported to avoid Network tab CORS errors
        if (!isCrossOriginImage(img.src)) {
          try {
            const res = await fetch(img.src, { mode: 'cors' });
            if (res.ok) {
              const blob = await res.blob();
              return await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(blob);
              });
            }
          } catch {
            // Fetch failed
          }
        }

        return null;
      };

      const canvas = await html2canvas(document.documentElement, {
        logging: false,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        scale: 1,
        x,
        y,
        width,
        height,
        windowWidth: fullWidth,
        windowHeight: fullHeight,
        scrollX: 0,
        scrollY: 0,
        onclone: async (documentClone) => {
          const liveImages = Array.from(document.querySelectorAll('img'));
          const cloneImages = Array.from(documentClone.querySelectorAll('img'));

          await Promise.all(
            cloneImages.map(async (cloneImg, index) => {
              const liveImg = liveImages[index];

              // Remove lazy loading attribute so browser renders image in clone
              cloneImg.removeAttribute('loading');
              cloneImg.setAttribute('loading', 'eager');

              if (!liveImg) return;

              const dataUrl = await imageToDataUrl(liveImg);
              if (dataUrl) {
                cloneImg.src = dataUrl;
              }
            })
          );
        }
      });

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((imageBlob) => {
          if (imageBlob) {
            resolve(imageBlob);
          } else {
            reject(new Error('Unable to create screenshot image'));
          }
        }, 'image/png');
      });

      const fileName = `screenshot-${Date.now()}-${mode === 'full' ? 'full' : 'visible'}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });
      addScreenshotToForm(file);
      showSuccessToast('Screenshot added to attachments');
    } catch {
      showErrorToast('Unable to capture screenshot right now.');
    } finally {
      popupOverlay.style.display = originalOverlayDisplay || '';
      popupContent.style.display = originalPopupDisplay || '';
      popupContent.style.visibility = originalPopupVisibility || 'visible';
      window.scrollTo(originalScrollX, originalScrollY);
      setIsCapturing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      files.forEach((file) => addScreenshotToForm(file));
    }
  };

  const handleRemoveFile = (index) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }));
    setPreviewUrls(prev => {
      const next = prev.filter((_, i) => i !== index);
      const removedUrl = prev[index];
      if (removedUrl) {
        URL.revokeObjectURL(removedUrl);
      }
      return next;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      // alert('Please fill in all required fields (Name, Email, and Message)');
      showErrorToast('Please fill in all required fields (Name, Email, and Message)');
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      // Append basic fields
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('dealerId', formData.dealerId || '');
      submitData.append('message', formData.message);

      // Append each file with simple key
      formData.screenshots.forEach((file) => {
        submitData.append('screenshots[]', file);
      });
      // console.log(formData, 'form data');

      const response = await submitSupportRequest(submitData);

      // alert('Support request sent successfully! Our team will reply within 24 hours.');
      showSuccessToast(response?.message || 'Support request sent successfully! Our team will reply within 24 hours.');
      onClose();

    } catch (error) {
      if (error?.response?.data?.responseCode === 422) {
        showErrorToast(
          Object.values(error?.response?.data?.messages)[0][0] ||
          "Failed to submit support request"
        );
      } else {
        showErrorToast(
          error?.response?.data?.message ||
          "Failed to submit support request"
        );
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="support-popup-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="support-popup-content" style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
      }}>
        <button
          onClick={onClose}
          className="modal-close-btn"
          style={{
            position: 'absolute',
            top: '12px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#09090B',
            opacity: 0.7
          }}
        >
          ×
        </button>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 500,
          color: '#09090B',
          fontFamily: 'Oswald',
          marginTop: 0,
          marginBottom: '4px'
        }}>
          Human Support
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#52525C',
          marginBottom: '24px',
          fontWeight: 400
        }}>
          We'll reply within 24 hours
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-hero-white" style={{ marginBottom: '16px' }}>
            <input
              type="text"
              name="name"
              id="supportName"
              value={formData.name}
              onChange={handleInputChange}
              placeholder=" "
              required
            />
            <label className="input-name" htmlFor="supportName">
              Name *
            </label>
          </div>

          <div className="input-hero-white" style={{ marginBottom: '16px' }}>
            <input
              type="email"
              name="email"
              id="supportEmail"
              value={formData.email}
              onChange={handleInputChange}
              placeholder=" "
              required
            />
            <label className="input-name" htmlFor="supportEmail">
              Email *
            </label>
          </div>

          <div className="input-hero-white" style={{ marginBottom: '16px' }}>
            <input
              type="text"
              name="dealerId"
              id="supportDealerId"
              value={formData.dealerId}
              onChange={handleInputChange}
              placeholder=" "
            />
            <label className="input-name" htmlFor="supportDealerId">
              Dealer ID (Optional)
            </label>
          </div>

          <div className="input-hero-white" style={{ marginBottom: '16px' }}>
            <textarea
              name="message"
              id="supportMessage"
              value={formData.message}
              onChange={handleInputChange}
              placeholder=" "
              rows="4"
              required
              style={{ resize: 'vertical' }}
            />
            <label className="input-name" htmlFor="supportMessage">
              Describe your issue *
            </label>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#3F3F47',
              fontWeight: 500
            }}>
              Attach Screenshot(s) (Optional)
            </label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
              <button
                type="button"
                className="green-btn"
                onClick={() => captureScreenshot('visible')}
                disabled={isCapturing}
                style={{
                  padding: '10px 14px',
                  fontSize: '14px',
                  borderRadius: '10px',
                  opacity: isCapturing ? 0.75 : 1,
                  minWidth: '170px',
                  backgroundImage: 'none',
                  backgroundColor: 'rgba(46, 125, 50, 0.08)',
                  color: '#2E7D32',
                  border: '1.5px solid #2E7D32',
                  boxShadow: '0 0 0 1px rgba(46, 125, 50, 0.08)'
                }}
              >
                {isCapturing ? 'Capturing...' : 'Capture Visible Screen'}
              </button>
              <button
                type="button"
                className="green-btn"
                onClick={() => captureScreenshot('full')}
                disabled={isCapturing}
                style={{
                  padding: '10px 14px',
                  fontSize: '14px',
                  borderRadius: '10px',
                  opacity: isCapturing ? 0.75 : 1,
                  minWidth: '170px',
                  backgroundImage: 'none',
                  backgroundColor: 'rgba(46, 125, 50, 0.08)',
                  color: '#2E7D32',
                  border: '1.5px solid #2E7D32',
                  boxShadow: '0 0 0 1px rgba(46, 125, 50, 0.08)'
                }}
              >
                {isCapturing ? 'Capturing...' : 'Capture Full Screen'}
              </button>
            </div>

            <div className="file-input-wrapper">
              <button
                type="button"
                className="file-input-button"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Files
              </button>
              <input
                type="file"
                name="screenshot"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="file-input-hidden"
                multiple
              />
              <span className="file-input-text">
                {formData.screenshots.length > 0
                  ? `${formData.screenshots.length} file(s) chosen`
                  : 'No file chosen'}
              </span>
            </div>

            {previewUrls.length > 0 && (
              <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {previewUrls.map((url, index) => (
                  <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-block', textDecoration: 'none' }}
                    >
                      <img
                        src={url}
                        alt={`Screenshot ${index + 1}`}
                        draggable={false}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #E4E4E7',
                          pointerEvents: 'auto',
                          userSelect: 'none'
                        }}
                      />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        backgroundColor: '#EA4335',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '22px',
                        height: '22px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="green-btn"
            style={{
              width: '100%',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 600,
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? 'Sending...' : 'Send to Support Team'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportPopup;