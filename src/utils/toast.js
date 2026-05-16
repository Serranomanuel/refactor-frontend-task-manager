/**
 * @module toast
 * @description Sistema de notificaciones toast que reemplaza alert().
 * Uso: import { showToast } from '../../utils/toast.js';
 *      showToast('Mensaje', 'success' | 'error' | 'warning' | 'info')
 */

// Inyecta los estilos del toast una sola vez
const injectStyles = () => {
    if (document.getElementById('toast-styles')) return;
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        #toast-container {
            position: fixed;
            bottom: 1.5rem;
            right: 1.5rem;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            pointer-events: none;
        }
        .toast {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            padding: 1rem 1.25rem;
            border-radius: 10px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            font-family: 'Segoe UI', sans-serif;
            font-size: 0.9rem;
            min-width: 280px;
            max-width: 380px;
            pointer-events: all;
            animation: toastIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
            position: relative;
            overflow: hidden;
        }
        .toast.hiding {
            animation: toastOut 0.3s ease forwards;
        }
        .toast-icon {
            font-size: 1.2rem;
            flex-shrink: 0;
            margin-top: 0.05rem;
        }
        .toast-body {
            flex: 1;
        }
        .toast-title {
            font-weight: 700;
            margin-bottom: 0.2rem;
        }
        .toast-msg {
            color: inherit;
            opacity: 0.85;
            line-height: 1.4;
        }
        .toast-close {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            opacity: 0.5;
            padding: 0;
            color: inherit;
            flex-shrink: 0;
            transition: opacity 0.2s;
        }
        .toast-close:hover { opacity: 1; }
        .toast-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            border-radius: 0 0 10px 10px;
            animation: toastBar var(--toast-duration, 4000ms) linear forwards;
        }

        /* Tipos */
        .toast-success {
            background: #d4edda;
            color: #155724;
            border-left: 4px solid #28a745;
        }
        .toast-success .toast-bar { background: #28a745; }

        .toast-error {
            background: #f8d7da;
            color: #721c24;
            border-left: 4px solid #dc3545;
        }
        .toast-error .toast-bar { background: #dc3545; }

        .toast-warning {
            background: #fff3cd;
            color: #856404;
            border-left: 4px solid #ffc107;
        }
        .toast-warning .toast-bar { background: #ffc107; }

        .toast-info {
            background: #cce5ff;
            color: #004085;
            border-left: 4px solid #0056b3;
        }
        .toast-info .toast-bar { background: #0056b3; }

        @keyframes toastIn {
            from { opacity: 0; transform: translateX(110%); }
            to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes toastOut {
            from { opacity: 1; transform: translateX(0); }
            to   { opacity: 0; transform: translateX(110%); }
        }
        @keyframes toastBar {
            from { width: 100%; }
            to   { width: 0%; }
        }
    `;
    document.head.appendChild(style);
};

// Obtener o crear el contenedor
const getContainer = () => {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
};

const ICONS = {
    success: '✅',
    error:   '❌',
    warning: '⚠️',
    info:    'ℹ️',
};

const TITLES = {
    success: 'Éxito',
    error:   'Error',
    warning: 'Advertencia',
    info:    'Información',
};

/**
 * Muestra una notificación toast.
 * @param {string} message   - Texto del mensaje.
 * @param {'success'|'error'|'warning'|'info'} type - Tipo de notificación.
 * @param {number} duration  - Duración en ms (por defecto 4000).
 */
export const showToast = (message, type = 'info', duration = 4000) => {
    injectStyles();
    const container = getContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.setProperty('--toast-duration', `${duration}ms`);
    toast.innerHTML = `
        <span class="toast-icon">${ICONS[type] ?? 'ℹ️'}</span>
        <div class="toast-body">
            <div class="toast-title">${TITLES[type] ?? 'Aviso'}</div>
            <div class="toast-msg">${message}</div>
        </div>
        <button class="toast-close" aria-label="Cerrar">✕</button>
        <div class="toast-bar"></div>
    `;

    container.appendChild(toast);

    const dismiss = () => {
        toast.classList.add('hiding');
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    };

    toast.querySelector('.toast-close').addEventListener('click', dismiss);
    setTimeout(dismiss, duration);
};

/**
 * Toast de confirmación: muestra un modal estilizado en lugar de confirm().
 * Retorna una Promise<boolean>.
 * @param {string} message - Pregunta de confirmación.
 */
export const showConfirm = (message) => {
    injectStyles();

    // Inyectar estilos del confirm si no existen
    if (!document.getElementById('confirm-styles')) {
        const style = document.createElement('style');
        style.id = 'confirm-styles';
        style.textContent = `
            .confirm-overlay {
                position: fixed; inset: 0;
                background: rgba(0,0,0,0.45);
                z-index: 10000;
                display: flex; align-items: center; justify-content: center;
                animation: fadeIn 0.2s ease;
            }
            .confirm-box {
                background: #fff;
                border-radius: 12px;
                padding: 2rem;
                max-width: 360px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0,0,0,0.2);
                animation: scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .confirm-box .confirm-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
            .confirm-box p {
                color: #333;
                font-size: 1rem;
                margin-bottom: 1.5rem;
                line-height: 1.5;
                font-family: 'Segoe UI', sans-serif;
            }
            .confirm-actions { display: flex; gap: 0.75rem; justify-content: center; }
            .confirm-btn {
                padding: 0.65rem 1.5rem;
                border-radius: 8px;
                border: none;
                font-size: 0.95rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.1s, opacity 0.2s;
                font-family: 'Segoe UI', sans-serif;
            }
            .confirm-btn:active { transform: scale(0.97); }
            .confirm-yes { background: #dc3545; color: #fff; }
            .confirm-yes:hover { opacity: 0.9; }
            .confirm-no  { background: #e9ecef; color: #333; }
            .confirm-no:hover { background: #dee2e6; }
            @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
            @keyframes scaleIn { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        `;
        document.head.appendChild(style);
    }

    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';
        overlay.innerHTML = `
            <div class="confirm-box">
                <div class="confirm-icon">🗑️</div>
                <p>${message}</p>
                <div class="confirm-actions">
                    <button class="confirm-btn confirm-no">Cancelar</button>
                    <button class="confirm-btn confirm-yes">Eliminar</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('.confirm-yes').addEventListener('click', () => {
            overlay.remove();
            resolve(true);
        });
        overlay.querySelector('.confirm-no').addEventListener('click', () => {
            overlay.remove();
            resolve(false);
        });
    });
};