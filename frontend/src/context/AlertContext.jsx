import React, { createContext, useContext, useState, useCallback } from 'react';

const AlertContext = createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [confirmConfig, setConfirmConfig] = useState(null);

  const showAlert = useCallback((message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setAlerts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 3000);
  }, []);

  const showConfirm = useCallback((message, onConfirm) => {
    setConfirmConfig({
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmConfig(null);
      },
      onCancel: () => {
        setConfirmConfig(null);
      }
    });
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      {/* Global Alerts Container */}
      <div className="alert-container">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-toast alert-${alert.type}`}>
            {alert.type === 'error' && <span className="alert-icon">⚠</span>}
            {alert.type === 'success' && <span className="alert-icon">✔</span>}
            {alert.type === 'info' && <span className="alert-icon">ℹ</span>}
            <span>{alert.message}</span>
          </div>
        ))}
      </div>

      {/* Global Confirm Modal */}
      {confirmConfig && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <div className="confirm-header">SYSTEM CONFIRMATION</div>
            <h3>{confirmConfig.message}</h3>
            <div className="confirm-actions">
              <button className="btn-sm" onClick={confirmConfig.onConfirm}>PROCEED</button>
              <button className="btn-sm outline" onClick={confirmConfig.onCancel}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};
