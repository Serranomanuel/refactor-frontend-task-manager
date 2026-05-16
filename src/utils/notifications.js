// UTILIDAD DE NOTIFICACIONES

// ============================================================
//                      IMPORTACIONES
// ============================================================
import Swal from 'sweetalert2';


// ============================================================
//                        FUNCIONES
// ============================================================

// Alerta
export function showNotification(message, icon) {
    Swal.fire({
        toast: true,
        width: '450px',
        position: "top-end",
        icon: `${icon}`,
        title: `${message}`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
    });
}