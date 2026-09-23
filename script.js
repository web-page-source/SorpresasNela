// --- SÍNTESIS DE AUDIO PARA EFECTOS POP DIVERTIDOS ---
const AudioContextClass = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Sonido brillante y limpio ÚNICAMENTE para Reservar y Siguiente
function playPopButton() {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(820, audioCtx.currentTime + 0.09);
    
    gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.09);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.09);
}

// Función requerida por los onclick del HTML
function reproducirSonido() {
    playPopButton();
}

// Detección global: EXCLUSIVAMENTE los botones "Reservar" y "Siguiente" emitirán sonido
document.addEventListener('pointerdown', function(e) {
    const btnSoloSonido = e.target.closest('.reserve-btn, .next-floating-btn');
    
    if (btnSoloSonido) {
        playPopButton();
    }
});

function toggleMenu() {
    document.getElementById("sideMenu").classList.toggle("active");
}

// Obtención de credenciales desde el archivo config/env.js
const supabaseUrl = window.ENV?.SUPABASE_URL;
const supabaseKey = window.ENV?.SUPABASE_KEY;

let _supabase = null;
let tasaZelleCUP = 450; // Valor por defecto en caso de fallo de red

if (typeof supabase !== "undefined" && supabase.createClient && supabaseUrl && supabaseKey) {
    _supabase = supabase.createClient(supabaseUrl, supabaseKey);
} else {
    console.error("No se encontraron las credenciales de Supabase en config/env.js");
}

// Función para obtener la tasa Zelle -> CUP desde la tabla 'configuracion'
async function obtenerTasa() {
    if (!_supabase) return;
    try {
        const { data, error } = await _supabase
            .from("configuracion")
            .select("*")
            .maybeSingle();

        if (!error && data) {
            // Lee la propiedad donde se almacena la tasa
            const tasaConsultada = data.tasa_zelle_cup ?? data.valor ?? data.tasa;
            if (tasaConsultada && !isNaN(Number(tasaConsultada))) {
                tasaZelleCUP = Number(tasaConsultada);
            }
        }
    } catch (err) {
        console.error("Error al consultar la tasa en configuracion:", err);
    }
}

async function cargarContenido() {
  const catalogo = document.getElementById('catalogo-container');
  const reservaDoc = document.getElementById('reserva-selector-container');

  if(!catalogo || !reservaDoc) return;

  catalogo.innerHTML = "<p style='text-align:center;'>Cargando ofertas...</p>";
  reservaDoc.innerHTML = "";

  // 1. Consultar la tasa dinámica desde la base de datos
  await obtenerTasa();

  // 2. Cargar los productos
  const { data: productos, error } = await _supabase
    .from("productos")
    .select("*")
    .eq("activo", true);

  if (error) {
    console.error("Error cargando productos:", error);
    catalogo.innerHTML = "<p style='text-align:center;'>Error al cargar productos</p>";
    return;
  }

  const ordenPrioridad = ["La Sorpresa", "Decoración"];
  productos.sort((a, b) => {
    const idxA = ordenPrioridad.indexOf(a.cat);
    const idxB = ordenPrioridad.indexOf(b.cat);

    if (idxA !== -1 && idxB !== -1) return idxA - idxB || a.id - b.id;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    if (a.cat === "Extras") return 1;
    if (b.cat === "Extras") return -1;

    return a.cat.localeCompare(b.cat) || a.id - b.id;
  });

  let htmlCatalogo = "";
  let htmlReserva = "";
  let ultimoCat = "";

  productos.forEach((oferta) => {
    if (oferta.cat !== ultimoCat) {
      const tituloHtml = `<h3 class="cat-titulo" style="grid-column: 1/-1; text-align:center; margin-top:25px; margin-bottom:10px;">${oferta.cat}</h3>`;
      htmlCatalogo += tituloHtml;
      htmlReserva += tituloHtml;
      ultimoCat = oferta.cat;

      if (ultimoCat === "Pizzas") {
        const notaPizzas = `<div class="tagline" style="grid-column: 1/-1; text-align:center;">Pizzas para 50 personas</div>`;
        htmlCatalogo += notaPizzas;
        htmlReserva += notaPizzas;
      }
    }

    const notaOpcionalHTML = oferta.nota ? `<p style="font-size:0.8rem; opacity:0.8; margin-top:4px;">${oferta.nota}</p>` : "";
    const precioCUP_Vista = oferta.zelle * tasaZelleCUP;
    const imgSrc = oferta.img ? oferta.img : 'https://via.placeholder.com/300x150';

    const cardHTML = `
      <div class="card-oferta" onclick="agregarAlCarrito('${oferta.nombre}', ${oferta.zelle})">
        <img src="${imgSrc}" alt="${oferta.nombre}" loading="lazy">
        <div class="info-oferta">
          <h4 style="text-align:center;">${oferta.nombre}</h4>
          ${notaOpcionalHTML} 
          <div class="precio-box">
            <span class="p-zelle">${oferta.zelle} Zelle</span>
            <span class="p-cup">${precioCUP_Vista.toLocaleString()} CUP</span>
          </div>
        </div>
      </div>`;

    htmlCatalogo += cardHTML;
    htmlReserva += cardHTML;
  });

  catalogo.innerHTML = htmlCatalogo;
  reservaDoc.innerHTML = htmlReserva;
}

window.onload = cargarContenido;

let carrito = [];
let origenSeleccionado = null;

function actualizarResumen() {
    const displayFormulario = document.getElementById("display-total-dinamico");
    const resumenDiv = document.getElementById("resumen-pedido");
    const totalDiv = document.getElementById("total-acumulado");
    const selectTransporte = document.getElementById("municipio-select");
    
    let totalItems = 0;
    let totalZelle = 0;
    let html = ""; 

    carrito.forEach((item, index) => {
        const precioZ = Number(item.precio) || 0;
        const subZ = precioZ * item.cantidad;
        totalItems += item.cantidad;
        totalZelle += subZ;

        html += `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid rgba(0,0,0,0.05);">
            <div><span><strong>${item.cantidad}x</strong> ${item.nombre}</span></div>
            <button onclick="quitarUno(${index})" class="back-btn" style="padding:4px 10px; min-width:auto;">-</button>
        </div>`;
    });

    let costoTransporteZelle = 0;
    if (selectTransporte && selectTransporte.offsetParent !== null) {
        costoTransporteZelle = Number(selectTransporte.value) || 0;
        if (costoTransporteZelle > 0) {
            html += `<p style="font-size:0.85rem; margin-top:5px; text-align:center;">+ Transporte (${costoTransporteZelle} Zelle)</p>`;
        }
    }

    const totalZelleFinal = totalZelle + costoTransporteZelle;
    const totalCUP_Calculado = totalZelleFinal * tasaZelleCUP;

    if (displayFormulario) {
        const valorMostrar = (origenSeleccionado === 'cuba') 
            ? `${totalCUP_Calculado.toLocaleString()} CUP` 
            : `${totalZelleFinal.toLocaleString()} Zelle`;
        displayFormulario.innerHTML = `<span>Total a pagar: </span><strong>${valorMostrar}</strong>`;
    }

    if (resumenDiv) resumenDiv.innerHTML = html || "<p style='text-align:center;'>Carrito vacío</p>";
    if (totalDiv) totalDiv.innerHTML = `Total: ${totalZelleFinal} Zelle - ${totalCUP_Calculado.toLocaleString()} CUP`;
    
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
    showPage('reserva-datos');
    actualizarResumenFinalEnFormulario();
}

function showPage(pageId) {
    if (pageId === 'inicio') {
        carrito = [];
        const lugarInput = document.getElementById("lugar");
        const fechaInput = document.getElementById("fecha");
        if (lugarInput) lugarInput.value = "";
        if (fechaInput) fechaInput.value = "";
    }

    if (pageId === 'reserva-datos') {
        actualizarResumenFinalEnFormulario();
    }

    const paginas = document.querySelectorAll('.page');
    paginas.forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });

    const activa = document.getElementById(pageId);
    if (activa) {
        activa.classList.add('active');
        activa.style.display = 'block';
    }

    window.scrollTo(0, 0);
    actualizarResumen(); 
}

function agregarAlCarrito(nombre, precioZelle) {
    const paginaOfertas = document.getElementById('ofertas');
    if (paginaOfertas && paginaOfertas.classList.contains('active')) return;

    const itemExistente = carrito.find(item => item.nombre === nombre);
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({ nombre: nombre, precio: precioZelle, cantidad: 1 });
    }
    actualizarResumen();
}

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
    const fechaInput = document.getElementById('fecha').value; 
    const notas = document.getElementById("notas-provisionales").value;
    const selectTransporte = document.getElementById("municipio-select");
    const remesa = document.getElementById("remesa-input") ? document.getElementById("remesa-input").value : "";

    if (!lugar || !fechaInput) {
        alert("Por favor, completa la ubicación y la fecha del evento.");
        return;
    }

    let fechaLimpia = "";
    if (fechaInput) {
        const partes = fechaInput.split("T");
        const f = partes[0];
        const h = partes[1];
        let [h_pura, m_pura] = h.split(":");
        let horas = parseInt(h_pura);
        let ampm = horas >= 12 ? "PM" : "AM";
        let horas12 = horas % 12 || 12; 
        fechaLimpia = `${f} - ${horas12}:${m_pura} ${ampm}`;
    }

    const numero = "5350995513";

    let listaProductos = carrito.map(i => `${i.cantidad}x ${i.nombre}`).join("\n");
    let totalZelleBase = carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
    let costoTransporteZelle = 0;
    let infoTransporte = "No requerido";

    if (selectTransporte && selectTransporte.offsetParent !== null && selectTransporte.value !== "0") {
        costoTransporteZelle = Number(selectTransporte.value);
        infoTransporte = selectTransporte.options[selectTransporte.selectedIndex].text;
    }

    let totalZelleFinal = totalZelleBase + costoTransporteZelle;
    let totalFinalTexto = (origenSeleccionado === 'cuba') 
        ? `${(totalZelleFinal * tasaZelleCUP).toLocaleString()} CUP` 
        : `${totalZelleFinal.toLocaleString()} Zelle`;

    const mensaje = ` *NUEVO PEDIDO*\n\n${listaProductos}\n\n` +
                    `*Transportación:* ${infoTransporte}\n` +
                    `*Total a pagar:* ${totalFinalTexto}\n` +
                    `*Lugar:* ${lugar}\n` +
                    `*Fecha:* ${fechaLimpia}\n` +
                    `*Notas:* ${notas}\n` +
                    `*Servicio de remesa:* ${remesa ? remesa : "No"}`;

    const mensajeLimpio = mensaje.split('\n').join('%0A');
    window.location.href = "https://wa.me/" + numero + "?text=" + mensajeLimpio;
}

function toggleRemesa(show) {
    document.getElementById("menu-remesa").style.display = show ? "block" : "none";
    if (!show) {
        document.getElementById("remesa-input").value = "";
        document.getElementById("texto-remesa").textContent = "";
    }
}

function actualizarRemesa() {
    const valor = document.getElementById("remesa-input").value;
    const texto = document.getElementById("texto-remesa");
    if (valor && valor > 0) {
        texto.textContent = "Se entregarán " + (valor * 485) + " pesos";
    } else {
        texto.textContent = "";
    }
}

const baseDatosVideos = {
    bodas: [
        {url: 'https://www.facebook.com/reel/939347828773117', thumb: 'img/amor1.jpg'},
        {url: 'https://www.facebook.com/reel/32068951906084941', thumb: 'img/amor2.jpg'},
        {url: 'https://www.facebook.com/reel/1178728713809724', thumb: 'img/amor3.jpg'},
    ],
    cumple: [
        {url: 'https://www.facebook.com/reel/1226501842373495', thumb: 'img/cumple2.jpg'},
        {url: 'https://www.facebook.com/reel/1217206760595889', thumb: 'img/fondoc1.jpg'},
        {url: 'https://www.facebook.com/reel/25645078845160042', thumb: 'img/fondocumple3.jpg'},
    ],
    familia: [
        {url: 'https://www.facebook.com/reel/1471106524634726', thumb: 'img/adian1.jpg'},
        {url: 'https://www.facebook.com/reel/3676869279122841', thumb: 'img/fodofam1.jpg'},
        {url: 'https://www.facebook.com/reel/876648678127336', thumb: 'img/fondofam2.jpg'},
    ]
};

function abrirGaleriaVideos(categoria) {
    const modal = document.getElementById("video-galeria-modal");
    const container = document.getElementById("video-reproductores-container");
    const titulo = document.getElementById("video-galeria-titulo");

    if (!container || !modal) return;
    container.innerHTML = "";

    const titulosMap = {
        'bodas': "Porque el amor mueve el mundo",
        'cumple': "Porque mereces ser feliz en tu día",
        'familia': "Porque la familia es lo más importante"
    };
    titulo.innerText = titulosMap[categoria] || "Galería de Momentos";

    const listaVideos = baseDatosVideos[categoria] || [];
    if (listaVideos.length > 0) {
        listaVideos.forEach((video) => {
            container.innerHTML += `
                <div class="video-card-fb" onclick="window.open('${video.url}', '_blank')" style="background-image: url('${video.thumb}'); background-size: cover; height: 180px; border-radius: 16px; position: relative; cursor: pointer;">
                    <div style="position: absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.25); border-radius:16px; display:flex; justify-content:center; align-items:center;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" width="35" alt="Play">
                    </div>
                </div>`;
        });
    } else {
        container.innerHTML = "<p style='color:gray; text-align:center;'>Próximamente más recuerdos...</p>";
    }

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function cerrarGaleriaVideos() {
    const modal = document.getElementById("video-galeria-modal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

document.addEventListener("click", function(event) {
    const sideMenu = document.getElementById("sideMenu");
    const menuBtn = document.querySelector(".menu-btn");
    if (sideMenu && sideMenu.classList.contains("active") && !sideMenu.contains(event.target) && !menuBtn.contains(event.target)) {
        sideMenu.classList.remove("active");
    }
});

function seleccionarOrigen(tipo) {
    origenSeleccionado = tipo;
    const btnCuba = document.getElementById('btn-pago-cuba');
    const btnExterior = document.getElementById('btn-pago-exterior');
    const bloqueDetalles = document.getElementById('campos-detalles-reserva');
    const displayTotal = document.getElementById('display-total-dinamico');

    if(btnCuba) btnCuba.classList.remove('seleccionada');
    if(btnExterior) btnExterior.classList.remove('seleccionada');

    if (tipo === 'cuba' && btnCuba) btnCuba.classList.add('seleccionada');
    if (tipo === 'exterior' && btnExterior) btnExterior.classList.add('seleccionada');

    if(bloqueDetalles) bloqueDetalles.style.display = "block";
    if(displayTotal) displayTotal.style.display = "block";

    actualizarResumenFinalEnFormulario();
}

function actualizarResumenFinalEnFormulario() {
    const contenedorResumen = document.getElementById("resumen-final-datos");
    const displayTotal = document.getElementById('display-total-dinamico');
    const selectTransporte = document.getElementById("municipio-select");

    if (!contenedorResumen) return;

    if (carrito.length === 0) {
        contenedorResumen.innerHTML = "<p style='text-align:center;'>No hay productos seleccionados.</p>";
        return;
    }

    let html = "<h4 style='text-align:center; margin-bottom:10px;'>Tu Pedido Actual:</h4><ul style='list-style:none; padding:0;'>";
    let totalZelle = 0;

    carrito.forEach(item => {
        totalZelle += item.precio * item.cantidad;
        html += `<li style='text-align:center;'><strong>${item.cantidad}x</strong> ${item.nombre}</li>`;
    });

    if (selectTransporte && selectTransporte.offsetParent !== null && selectTransporte.value !== "0") {
        totalZelle += Number(selectTransporte.value);
        html += `<li style="font-weight: bold; margin-top:5px; text-align:center;">Transporte: ${selectTransporte.options[selectTransporte.selectedIndex].text}</li>`;
    }

    html += "</ul>";
    contenedorResumen.innerHTML = html;

    if (displayTotal) {
        const textoTotal = (origenSeleccionado === 'cuba') 
            ? `${(totalZelle * tasaZelleCUP).toLocaleString()} CUP` 
            : `${totalZelle.toLocaleString()} Zelle`;
        displayTotal.innerHTML = `<span>Total a pagar: </span><strong>${textoTotal}</strong>`;
    }
}

function toggleMenuTransporte(mostrar) {
    const menu = document.getElementById("menu-municipios");
    if (menu) menu.style.display = mostrar ? "block" : "none";
    if (!mostrar) document.getElementById("municipio-select").value = "0";
    actualizarResumen();
    actualizarResumenFinalEnFormulario();
}