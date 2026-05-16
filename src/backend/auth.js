// CONSTANTES DE RUTAS

// DEFINIR URL BASE
const baseUrl = "http://localhost:3000"

export async function login(dataLogin) {

    // Login de usuario
    const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            document: dataLogin.document,
            password: dataLogin.password
        })
    })

    if (!res) {
        throw new Error("Error al realizar la solicitud");
        return
    }

    const response = await res.json()
    return response
};
