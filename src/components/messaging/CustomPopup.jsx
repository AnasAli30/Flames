import React from 'react';

const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const popupStyle = {
  background: '#23272f',
  color: '#fff',
  borderRadius: '12px',
  padding: '32px 24px 20px 24px',
  minWidth: 320,
  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
  textAlign: 'center',
  position: 'relative'
};

const buttonStyle = {
  margin: '0 10px',
  padding: '8px 18px',
  borderRadius: '6px',
  border: 'none',
  fontWeight: 600,
  fontSize: 16,
  cursor: 'pointer'
};

export default function CustomPopup({ open, onClose, onDeleteForMe, onDeleteForEveryone }) {
  if (!open) return null;
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={popupStyle} onClick={e => e.stopPropagation()}>
        <h3>Delete Message</h3>
        <p>Do you want to delete this message for everyone or just for you?</p>
        <div style={{ marginTop: 24 }}>
          <button
            style={{ ...buttonStyle, background: '#ff9800', color: '#fff' }}
            onClick={onDeleteForMe}
          >
            Delete for Me
          </button>
          <button
            style={{ ...buttonStyle, background: '#ff3b3b', color: '#fff' }}
            onClick={onDeleteForEveryone}
          >
            Delete for Everyone
          </button>
          <button
            style={{ ...buttonStyle, background: '#23272f', color: '#fff', border: '1px solid #fff' }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 