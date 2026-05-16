// src/utils/toast.js

export const showToast = (message, type = 'info') => {
  const toast = document.createElement('div');
  
  const colors = {
    success: { bg: '#d4edda', color: '#155724', border: '#c3e6cb' },
    error:   { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' },
    warning: { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' },
    info:    { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' }
  };
  
  const style = colors[type] || colors.info;

  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${style.bg};
    color: ${style.color};
    border: 1px solid ${style.border};
    border-radius: 8px;
    font-family: sans-serif;
    font-size: 0.9rem;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease;
  `;
  
  toast.textContent = message;

  if (!document.querySelector('#toast-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'toast-styles';
    styleEl.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(styleEl);
  }

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

export const showConfirm = (message) => {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 12px;
      max-width: 400px;
      width: 90%;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    `;

    dialog.innerHTML = `
      <p style="margin-bottom: 1.5rem; font-size: 1rem; color: #333;">${message}</p>
      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button id="btn-cancel" style="
          padding: 0.5rem 1.5rem;
          border: 1px solid #ccc;
          background: #f8f9fa;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
        ">Cancelar</button>
        <button id="btn-confirm" style="
          padding: 0.5rem 1.5rem;
          border: none;
          background: #dc3545;
          color: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
        ">Confirmar</button>
      </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    dialog.querySelector('#btn-cancel').addEventListener('click', () => {
      overlay.remove();
      resolve(false);
    });

    dialog.querySelector('#btn-confirm').addEventListener('click', () => {
      overlay.remove();
      resolve(true);
    });
  });
};