// Abrir/Cerrar Menú
function toggleMenu() {
    document.getElementById("sideMenu").classList.toggle("active");
}


const misOfertas = [
    // LA SORPRESA
    { cat: "La Sorpresa", nombre: "Plan Sorpresa Completo", zelle: 25, nota: "Incluye: video, canción a elección y animados disponibles.", img: "sorpresa.jpg" },

    // COMBOS
    { cat: "Combos", nombre: "Combo Buffet de Cumpleaños", zelle: 50, nota: "Incluye: pizza, cake, sorbeto, torejitas, galleticas, pan con pasta, ensalada fría.(para 25 personas)", img: "bufete.jpg" },
    { cat: "Decoración", nombre: "Decoración", zelle: 100, nota: "Incluye: Arreglo floral, decoración de globos, manteles, forros de asientos y centros de mesa.", img: "dec15.jpg" },

    // REGALOS
    { cat: "Regalos", nombre: "Ramo de Flores ", zelle: 15, img: "ramo2.jpg", nota: "" },
    { cat: "Regalos", nombre: "Cesta Mediana con Confituras", zelle: 15, img: "cestapeq.jpg", nota: "" },
    { cat: "Regalos", nombre: "Cesta Grande con Confituras", zelle: 25, img: "cestagrand.jpg", nota: "" },
    { cat: "Regalos", nombre: "Perfumes Originales", zelle: 15, img: "perypel.jpg", nota: "" },
    { cat: "Regalos", nombre: "Peluche Pequeño", zelle: 8, img: "peluchepeq.jpg", nota: "" },
    { cat: "Regalos", nombre: "Peluche Mediano", zelle: 15, img: "peluchemed.jpg", nota: "" },
    { cat: "Regalos", nombre: "Caja de Bombones ", zelle: 10, img: "Bombones rellenos.jpg", nota: "30 unidades" },

    // PIZZAS
    { cat: "Pizzas", nombre: "Pizza Familiar con Jamón y Queso", zelle: 10, img: "pizzajam.jpg", nota: "" },
    { cat: "Pizzas", nombre: "Pizza Familiar Napolitana", zelle: 8, img: "nap.jpg", nota: "" },
    { cat: "Pizzas", nombre: "Pizza Familiar con Salchicha", zelle: 12, img: "pizzasalch.jpg", nota: "" },
    { cat: "Pizzas", nombre: "Pizza Familiar con Doble Queso", zelle: 15, img: "dobleq.jpg", nota: "" },

    // PASTELES
    { cat: "Pasteles", nombre: "Pastel Personalizado ", zelle: 10, img: "cakeper.jpg", nota: "(para 15 personas)" },
    { cat: "Pasteles", nombre: "Pastel con Leche Condensada", zelle: 12, img: "cakeleche.jpg", nota: "(par 15 personas)" },
    { cat: "Pasteles", nombre: "Pastel Doble Personalizado ", zelle: 20, img: "cake1.jpg", nota: "(para 40-50 personas)" },
    { cat: "Pasteles", nombre: "Pastel con Nutella", zelle: 12, img: "cakenutella.jpg", nota: "(para 15 personas)" },

    // HELADOS
    { cat: "Helados", nombre: "Helado Original ", zelle: 10, img: "helado1.jpg", nota: "(4 Litros)" },
    { cat: "Helados", nombre: "Helado con 15 Bizcochos con Leche Condensada", zelle: 15, img: "hel1.jpg", nota: "" },
    { cat: "Helados", nombre: "Helado con 15 Donas Originales", zelle: 15, img: "hel2.jpg", nota: "" },
    { cat: "Helados", nombre: "Helado con 10 Paquetes de Sorbeto Grandes", zelle: 20, img: "hel3.jpg", nota: "" },

    // BEBIDAS
    { cat: "Bebidas", nombre: "Caja de Refresco", zelle: 18, img: "ref.jpg", nota: "" },
    { cat: "Bebidas", nombre: "Caja de Jugo", zelle: 16, img: "jugos.png" , nota: "" },
    { cat: "Bebidas", nombre: "Caja de Cerveza", zelle: 20, img: "cerv.jpg", nota: "(Mayabe-Cristal)" },
    { cat: "Bebidas", nombre: "Caja de Malta", zelle: 22, img: "malta.jpg", nota: "" },

    // EXTRAS
    { cat: "Extras", nombre: "Ensalada Fría ", zelle: 8, img: "ensalada2.jpg", nota: "(10 raciones)" },
    { cat: "Extras", nombre: "Ensalada Fría ", zelle: 12, img: "ensaladafria.jpg", nota: "(4 Litros)" },
    { cat: "Extras", nombre: "Flan de Leche", zelle: 6, img: "flan.jpg", nota: "" }
];


function cargarContenido() {
    const catalogo = document.getElementById('catalogo-container');
    const reservaDoc = document.getElementById('reserva-selector-container');
    const TASA_CALCULO = 450; // Solo para mostrar en la card

    catalogo.innerHTML = "";
    reservaDoc.innerHTML = "";
    let ultimoCat = "";

    misOfertas.forEach((oferta, index) => {
        if (oferta.cat !== ultimoCat) {
            const tituloHtml = `<h3 class="cat-titulo">${oferta.cat}</h3>`;
            catalogo.innerHTML += tituloHtml;
            reservaDoc.innerHTML += tituloHtml;
            ultimoCat = oferta.cat;

            if (ultimoCat === "Pizzas") {
                const notaPizzas = `<div class="nota-importante">Con estas Pizzas comen 50 personas</div>`;
                catalogo.innerHTML += notaPizzas;
                reservaDoc.innerHTML += notaPizzas;
            }
        }


        const notaOpcionalHTML = oferta.nota ? `<p class="nota-producto-card">${oferta.nota}</p>` : "";
        
        // Calculamos el CUP al vuelo para la vista
        const precioCUP_Vista = oferta.zelle * TASA_CALCULO;

        const cardHTML = `
            <div class="card-oferta" onclick="agregarAlCarrito('${oferta.nombre}', ${oferta.zelle})">
                <img src="${oferta.img ? 'img/' + oferta.img : 'https://via.placeholder.com/300x150'}" alt="${oferta.nombre}">
                <div class="info-oferta">
                    <h4 class="nombre-producto">${oferta.nombre}</h4>
                    ${notaOpcionalHTML} 
                    <div class="precio-box">
                        <span class="p-zelle">${oferta.zelle} Zelle</span>
                        <span class="p-cup">${precioCUP_Vista.toLocaleString()} CUP</span>
                    </div>
                </div>
            </div>`;

        catalogo.innerHTML += cardHTML;
        reservaDoc.innerHTML += cardHTML;
    });
}


// Ejecutar al cargar la página

window.onload = cargarContenido;



// --- VARIABLES DE ESTADO ---

let carrito = [];

let enFormulario = false; 

function actualizarResumen() {
    const TASA_FIJA = 450; 
    const displayFormulario = document.getElementById("display-total-dinamico");
    const resumenDiv = document.getElementById("resumen-pedido");
    const totalDiv = document.getElementById("total-acumulado");
    const selectTransporte = document.getElementById("municipio-select"); // Capturamos el select
    
    let totalItems = 0;
    let totalZelle = 0;
    let html = ""; 

    carrito.forEach((item, index) => {
        const precioZ = Number(item.precio) || 0;
        const subZ = precioZ * item.cantidad;
        
        totalItems += item.cantidad;
        totalZelle += subZ;

        html += `
        <div class="item-resumen" style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:8px;">
            <div style="flex: 1; min-width: 0; word-wrap: break-word;">
                <span style="font-size: 0.9rem; display: block; line-height: 1.2;">
                    <strong>${item.cantidad}x</strong> ${item.nombre}
                </span>
            </div>
            <div style="display:flex; align-items:center;">
                <button onclick="quitarUno(${index})" style="border:none; background:#ffeded; color:red; border-radius:5px; width:30px; height:30px; font-weight:bold;">-</button>
            </div>
        </div>`;
    });

    // --- LÓGICA DE TRANSPORTE ---
    let costoTransporteZelle = 0;
    // Sumamos solo si el menú está visible y tiene un valor seleccionado
    if (selectTransporte && selectTransporte.offsetParent !== null) {
        costoTransporteZelle = Number(selectTransporte.value) || 0;
        if (costoTransporteZelle > 0) {
            html += `<p style="font-size:0.8rem; color: #7C5136; margin: 0;">+ Transporte equipo (${costoTransporteZelle} Zelle)</p>`;
        }
    }

    const totalZelleFinal = totalZelle + costoTransporteZelle;
    const totalCUP_Calculado = totalZelleFinal * TASA_FIJA;

    if (displayFormulario) {
        const valorMostrar = (origenSeleccionado === 'cuba') 
            ? `${totalCUP_Calculado.toLocaleString()} CUP` 
            : `${totalZelleFinal.toLocaleString()} Zelle`;

        displayFormulario.innerHTML = `
            <span style="font-family: 'Adlery'; color: var(--color-texto);">Total a pagar: </span>
            <span style="font-family: 'Adlery'; color: var(--color-texto);">${valorMostrar}</span>`;
    }

    if (resumenDiv) resumenDiv.innerHTML = html || "<p style='text-align:center;'>Carrito vacío</p>";
    if (totalDiv) totalDiv.innerHTML = `Total: ${totalZelleFinal} Zelle - ${totalCUP_Calculado.toLocaleString()} CUP`;
    
    // ... resto de la lógica de botones se mantiene igual
    const cartCount = document.getElementById("cart-count");
    if (cartCount) cartCount.innerText = totalItems;
    
    const cartBtn = document.getElementById("cart-icon-button");
    const btnSiguiente = document.getElementById("btn-siguiente-flotante");
    const esSeleccion = document.getElementById('reserva-seleccion')?.classList.contains('active');

    if (esSeleccion && totalItems > 0) {
        if (cartBtn) cartBtn.style.display = "flex";
        if (btnSiguiente) btnSiguiente.style.display = "block";
    } else {
        if (cartBtn) cartBtn.style.display = "none";
        if (btnSiguiente) btnSiguiente.style.display = "none";
    }
}


function irAlFormulario() {
    const overlay = document.getElementById("carrito-overlay");
    if (overlay) overlay.style.display = "none";

    // Mostramos la página
    showPage('reserva-datos');
    
    // Forzamos la actualización visual
    actualizarResumenFinalEnFormulario();
}

function showPage(pageId) {
    // --- NUEVA LÓGICA DE REINICIO ---
    // Si el usuario vuelve al inicio, reseteamos todo
    if (pageId === 'inicio') {
        carrito = []; // Vaciamos el arreglo
        // Si tienes campos de texto en el formulario, los limpiamos también:
        const lugarInput = document.getElementById("lugar");
        const fechaInput = document.getElementById("fecha");
        if (lugarInput) lugarInput.value = "";
        if (fechaInput) fechaInput.value = "";
        
        console.log("Carrito vaciado y formulario reiniciado");
    }

    if (pageId === 'reserva-datos') {
        actualizarResumenFinalEnFormulario();
    }
    // --------------------------------

    // 1. Ocultamos todas las páginas
    const paginas = document.querySelectorAll('.page');
    paginas.forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });

    // 2. Mostramos la página actual
    const activa = document.getElementById(pageId);
    if (activa) {
        activa.classList.add('active');
        activa.style.display = 'block';
    }

    // 3. REGLA DE VISIBILIDAD Y ACTUALIZACIÓN
    // Llamamos a actualizarResumen para que los botones desaparezcan 
    // y el modal se limpie visualmente de inmediato.
    window.scrollTo(0, 0);
    actualizarResumen(); 
}

function agregarAlCarrito(nombre, precioZelle) { // <-- Quitamos precioCUP de aquí
    const paginaOfertas = document.getElementById('ofertas');
    if (paginaOfertas && paginaOfertas.classList.contains('active')) return;

    const itemExistente = carrito.find(item => item.nombre === nombre);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({ 
            nombre: nombre, 
            precio: precioZelle, 
            // Ya no guardamos .cup aquí para evitar conflictos
            cantidad: 1 
        });
    }
    actualizarResumen();
}


// 5. FUNCIONES EXTRA
function toggleCarrito() {
    const overlay = document.getElementById("carrito-overlay");
    if (overlay) {
        overlay.style.display = (overlay.style.display === "flex") ? "none" : "flex";
    }
}

function quitarUno(index) {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
    } else {
        carrito.splice(index, 1);
    }
    actualizarResumen();
}

function finalizarPedido() {
    const lugar = document.getElementById("lugar").value;
    const notas = document.getElementById("notas-provisionales").value;
    const selectTransporte = document.getElementById("municipio-select");
    let fechaInput = document.getElementById('fecha').value; 
    let fechaLimpia = "";

if (fechaInput) {
    // 1. Separamos la fecha de la hora (ej: "2026-04-03" y "14:30")
    const [f, h] = fechaInput.split("T");
    
    // 3. Lógica para AM/PM
    const ampm ="";

    if(horas>12){
    ampm="PM";
}else{
    ampm="AM";
}

    fechaLimpia = `${f} - ${h}${ampm}`;
}
    const numero = "5363747155";
    const TASA = 450; 

    if (!lugar || !fecha) {
        alert("Por favor, completa el lugar y la fecha de entrega.");
        return;
    }

    // 1. Lista de productos
    let listaProductos = carrito.map(i => `✅ ${i.cantidad}x ${i.nombre}`).join("%0A");

    // 2. Cálculo de totales (Base + Transporte)
    let totalZelleBase = carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
    let costoTransporteZelle = 0;
    let infoTransporte = "No requerido";

    // Si el menú existe y tiene un valor seleccionado
    if (selectTransporte && selectTransporte.offsetParent !== null && selectTransporte.value !== "0") {
        costoTransporteZelle = Number(selectTransporte.value);
        infoTransporte = selectTransporte.options[selectTransporte.selectedIndex].text;
    }

    let totalZelleFinal = totalZelleBase + costoTransporteZelle;
    
    // 3. Lógica de moneda según la selección
    let totalFinalTexto = "";
    if (origenSeleccionado === 'cuba') {
        const totalCUP = totalZelleFinal * TASA;
        totalFinalTexto = `${totalCUP.toLocaleString()} CUP`;
    } else {
        totalFinalTexto = `${totalZelleFinal.toLocaleString()} Zelle`;
    }

    // 4. Construcción del mensaje (Añadimos la línea de Transporte)
    const mensaje = `📌 *NUEVO PEDIDO*%0A%0A` +
                    `*Detalle:*%0A${listaProductos}%0A%0A` +
                    `🚚 *Transporte:* ${infoTransporte}%0A` +
                    `💰 *Total a pagar:* ${totalFinalTexto}%0A` +
                    `📍 *Lugar:* ${lugar}%0A` +
                    `📅 *Fecha:* ${fechaLimpia}%0A` +
                    `📝 *Notas:* ${notas}`;
    
    // 5. Abrir WhatsApp


    window.open(`https://wa.me/${numero}?text=${mensaje}`, '_blank');
}


// --- BASE DE DATOS DE VIDEOS LOCALES (Solo rutas) ---
const baseDatosVideos = {
    bodas: [
        'https://www.facebook.com/reel/939347828773117', // Videos verticales grabados con celular
        'https://www.facebook.com/reel/32068951906084941',
        'https://www.facebook.com/reel/1178728713809724',
    ],
    cumple: [
        'https://www.facebook.com/reel/1226501842373495',
        'https://www.facebook.com/reel/1217206760595889',
        'https://www.facebook.com/reel/25645078845160042',
    ],
    familia: [ // NUEVA CATEGORÍA
        'https://www.facebook.com/reel/1471106524634726',
        'https://www.facebook.com/reel/3676869279122841',
        'https://www.facebook.com/reel/876648678127336'
    ]
};
function abrirGaleriaVideos(categoria) {
    const modal = document.getElementById("video-galeria-modal");
    const container = document.getElementById("video-reproductores-container");
    const titulo = document.getElementById("video-galeria-titulo");

    if (!container || !modal) return;

    // 1. Limpiar contenido previo
    container.innerHTML = "";

    // 2. Títulos dinámicos según la categoría
    const titulosMap = {
        'bodas': "Porque el amor mueve el mundo",
        'cumple': "Porque mereces ser feliz en tu día",
        'familia': "Porque la familia es lo más importante"
    };
    titulo.innerText = titulosMap[categoria] || "Galería de Momentos";

    // 3. Obtener videos de la base de datos
    const listaVideos = baseDatosVideos[categoria] || [];

    if (listaVideos.length > 0) {
        listaVideos.forEach((url, index) => {
            // Generamos el HTML compatible con Facebook
            const mosaicoHtml = `
                <div class="video-card-fb" onclick="window.open('${url}', '_blank')">
                    <div class="play-overlay">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" width="30">
                        <span>Ver Video #${index + 1}</span>
                    </div>
                </div>`;
            container.innerHTML += mosaicoHtml;
        });
    } else {
        container.innerHTML = "<p style='color:gray; text-align:center; grid-column: 1/-1;'>Próximamente más recuerdos...</p>";
    }

    // 4. Abrir el modal y bloquear scroll
    modal.classList.add('open');
    modal.style.display = "flex"; // Asegura visibilidad si no usas solo clases
    document.body.style.overflow = "hidden";
}

// Función para cerrar (Asegúrate de tenerla así)
function cerrarGaleriaVideos() {
    const modal = document.getElementById("video-galeria-modal");
    if (modal) {
        modal.classList.remove('open');
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}




window.onclick = function(event) {
    const modal = document.getElementById("video-galeria-modal");
    if (event.target === modal) {
        cerrarGaleriaVideos();
    }
}
// CERRAR AL CLICKEAR FUERA
document.addEventListener("click", function(event) {
    const sideMenu = document.getElementById("sideMenu");
    const menuBtn = document.querySelector(".menu-btn");

    // Si el menú está abierto Y el clic NO fue dentro del menú Y NO fue en el botón de abrir...
    if (sideMenu.classList.contains("active") && 
        !sideMenu.contains(event.target) && 
        !menuBtn.contains(event.target)) {
        
        sideMenu.classList.remove("active");
    }
});
let origenSeleccionado = null;

function seleccionarOrigen(tipo) {
    origenSeleccionado = tipo;

    const btnCuba = document.getElementById('btn-pago-cuba');
    const btnExterior = document.getElementById('btn-pago-exterior');
    const bloqueDetalles = document.getElementById('campos-detalles-reserva');
    const displayTotal = document.getElementById('display-total-dinamico');

    // Lógica de clases visuales
    btnCuba.classList.remove('seleccionada');
    btnExterior.classList.remove('seleccionada');

    if (tipo === 'cuba') {
        btnCuba.classList.add('seleccionada');
    } else {
        btnExterior.classList.add('seleccionada');
    }

    // --- CÁLCULO CON TASA DE CAMBIO ---
    const TASA = 450; 
    let totalZelle = 0;

    carrito.forEach(item => {
        totalZelle += (item.precio * item.cantidad);
    });

    // Calculamos el CUP basado en el total Zelle acumulado
    let totalCUP = totalZelle * TASA;

    bloqueDetalles.style.display = "block";
    displayTotal.style.display = "block";

    if (tipo === 'cuba') {
        displayTotal.innerHTML = `
            <span style="font-family: 'Adlery'; color: var(--color-texto);">Total a pagar: </span>
            <span style="font-family: 'Adlery'; color: var(--color-texto);">${totalCUP.toLocaleString()} CUP</span>`;
    } else {
        displayTotal.innerHTML = `
            <span style="font-family: 'Adlery'; color: var(--color-texto);">Total a pagar: </span>
            <span style="font-family: 'Adlery'; color: var(--color-texto);">${totalZelle.toLocaleString()} Zelle</span>`;
    }

    actualizarResumenFinalEnFormulario();
}

function actualizarResumenFinalEnFormulario() {
    const contenedorResumen = document.getElementById("resumen-final-datos");
    const displayTotal = document.getElementById('display-total-dinamico');
    const selectTransporte = document.getElementById("municipio-select");
    const TASA = 450;

    if (!contenedorResumen) return;

    if (carrito.length === 0) {
        contenedorResumen.innerHTML = "<p style='text-align:center;'>No hay productos seleccionados.</p>";
        return;
    }

    let html = "<h4 style='margin-bottom:10px; border-bottom:1px solid #7C5136;'>Tu Pedido Actual:</h4><ul>";
    let totalZelle = 0;

    // 1. Sumar productos
    carrito.forEach(item => {
        const subZ = item.precio * item.cantidad;
        totalZelle += subZ;
        html += `<li><strong>${item.cantidad}x</strong> ${item.nombre}</li>`;
    });

    // 2. Sumar Transporte (si está visible y seleccionado)
    let infoTransporte = "";
    if (selectTransporte && selectTransporte.offsetParent !== null && selectTransporte.value !== "0") {
        const extra = Number(selectTransporte.value);
        totalZelle += extra;
        infoTransporte = selectTransporte.options[selectTransporte.selectedIndex].text;
        html += `<li style="color: #7C5136; font-weight: bold;">Transporte: ${infoTransporte}</li>`;
    }

    html += "</ul>";
    contenedorResumen.innerHTML = html;

    // 3. ACTUALIZACIÓN DEL TOTAL (Aquí está la magia)
    // Esta parte asegura que el precio cambie si el usuario cambia la moneda
    if (displayTotal) {
        if (origenSeleccionado === 'cuba') {
            const totalCUP = totalZelle * TASA;
            displayTotal.innerHTML = `
                <span style="font-family: 'Adlery';">Total a pagar: </span>
                <span style="font-family: 'Adlery';">${totalCUP.toLocaleString()} CUP</span>`;
        } else {
            displayTotal.innerHTML = `
                <span style="font-family: 'Adlery';">Total a pagar: </span>
                <span style="font-family: 'Adlery';">${totalZelle.toLocaleString()} Zelle</span>`;
        }
    }
}

function toggleMenuTransporte(mostrar) {
    const menu = document.getElementById("menu-municipios");
    if (!menu) return;

    menu.style.display = mostrar ? "block" : "none";
    
    if (!mostrar) {
        document.getElementById("municipio-select").value = "0";
    }
    
    actualizarResumen();// Recalcula el total y el resumen visual inmediatamente
    actualizarResumenFinalEnFormulario();
}