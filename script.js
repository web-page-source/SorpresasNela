// 1. Abrir y Cerrar Modal
const modal = document.getElementById("modal-registro");
const btnCrear = document.querySelector(".btn-create-account");

btnCrear.onclick = (e) => {
    e.preventDefault();
    modal.style.display = "block";
}

function cerrarModal() {
    modal.style.display = "none";
}
// 1. Configuración (REEMPLAZA LA KEY POR LA "anon public" DE SUPABASE)
const SUPABASE_URL = 'https://otdvprabdsombmzfkuhs.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZHZwcmFiZHNvbWJtemZrdWhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMDk3MTUsImV4cCI6MjA5MTc4NTcxNX0.DiN8VdtZYc9xzN9o2pvKlrDvoHW42ec-GTVDCSloR4w'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function enviarDatosABaseDeDatos(usuario) {
    const { data, error } = await _supabase
        .from('usuarios')
        .insert([
            { 
                username: usuario.username, // Nuevo campo
                nombre: usuario.nombre, 
                apellidos: usuario.apellidos, 
                carnet_id: usuario.carnet, 
                correo: usuario.correo,
                password: usuario.password // Nuevo campo
            }
        ]);

    if (error) {
        console.error("Error de SQL:", error.message);
        alert("Error al registrar: " + error.message);
    } else {
        alert("¡Éxito! Tu cuenta ha sido guardada en la base de datos SQL.");
    }
}

function mostrarError(mensaje, evento) {
    // Buscar o crear el overlay oscuro
    let overlay = document.getElementById("error-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "error-overlay";
        document.body.appendChild(overlay);
    }

    // Buscar o crear la burbuja
    let burbuja = document.getElementById("error-bubble");
    if (!burbuja) {
        burbuja = document.createElement("div");
        burbuja.id = "error-bubble";
        burbuja.className = "error-bubble";
        document.body.appendChild(burbuja);
    }

    burbuja.innerText = mensaje;
    
    // Mostrar ambos elementos
    overlay.style.display = "block";
    burbuja.style.display = "block";

    if(evento) evento.stopPropagation();
}

// Cerrar todo al hacer clic fuera
document.addEventListener("click", () => {
    const overlay = document.getElementById("error-overlay");
    const burbuja = document.getElementById("error-bubble");
    
    if (overlay) overlay.style.display = "none";
    if (burbuja) burbuja.style.display = "none";
});
// 3. Procesar y Validar Datos al dar clic en Registrar
document.getElementById("form-registro").onsubmit = async function(e) {
    e.preventDefault();

    // Captura de nuevos campos
    let username = document.getElementById("username").value.trim().toLowerCase();
    let password = document.getElementById("password").value;
    let nombre = document.getElementById("nombre").value.trim();
    let apellidos = document.getElementById("apellidos").value.trim();
    let carnet = document.getElementById("carnet").value.trim();
    let correo = document.getElementById("correo").value.trim();

// 3. Procesar y Validar Datos al dar clic en Registrar
document.getElementById("form-registro").onsubmit = async function(e) {
    e.preventDefault();

    // Captura de campos (asegúrate de que estos IDs existan en tu HTML)
    let username = document.getElementById("username").value.trim().toLowerCase();
    let password = document.getElementById("password").value;
    let nombre = document.getElementById("nombre").value.trim();
    let apellidos = document.getElementById("apellidos").value.trim();
    let carnet = document.getElementById("carnet").value.trim();
    let correo = document.getElementById("correo").value.trim();

    // --- NUEVA VERIFICACIÓN INTERNA DE USERNAME ---
    const { data: existe } = await _supabase
        .from('usuarios')
        .select('username')
        .eq('username', username)
        .maybeSingle();

    if (existe) {
        mostrarError("Nombre de usuario no disponible", e); // Uso de burbuja
        return; 
    }
    // ----------------------------------------------

    // Regla: Capitalización
    const formatearNombre = (str) => {
        return str.toLowerCase().split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
    };

    nombre = formatearNombre(nombre);
    apellidos = formatearNombre(apellidos);

    // Regla: Validación Carnet Cubano
    if (!/^\d{11}$/.test(carnet)) {
        mostrarError("CI inválido: deben ser 11 dígitos", e); // Uso de burbuja
        return;
    }

    const aa = carnet.substring(0, 2);
    const mm = parseInt(carnet.substring(2, 4));
    const dd = parseInt(carnet.substring(4, 6));

    if (mm < 1 || mm > 12) {
        mostrarError("CI inválido: mes no válido", e); // Uso de burbuja
        return;
    }

    const diasPorMes = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (dd < 1 || dd > diasPorMes[mm - 1]) {
        mostrarError("CI inválido: día no válido", e); // Uso de burbuja
        return;
    }

    // Objeto actualizado con los nuevos campos
    const nuevoUsuario = { username, nombre, apellidos, carnet, correo, password };

    // Ejecutar el envío a Supabase
    await enviarDatosABaseDeDatos(nuevoUsuario); 
    
    cerrarModal();
};
}
