let competidores = [];
let tiempoInicio = 0;
let tiempoTranscurrido = 0;
let intervalo = null;
let cronometroActivo = false;

const nombreCompetidor = document.getElementById("nombreCompetidor");
const btnAgregar = document.getElementById("btnAgregar");
const listaCompetidores = document.getElementById("listaCompetidores");
const selectCompetidor = document.getElementById("selectCompetidor");
const btnIniciar = document.getElementById("btnIniciar");
const btnDetener = document.getElementById("btnDetener");
const btnRegistrar = document.getElementById("btnRegistrar");
const btnReiniciar = document.getElementById("btnReiniciar");
const pantallaCronometro = document.getElementById("pantallaCronometro");
const tablaResultados = document.getElementById("tablaResultados");
const mensaje = document.getElementById("mensaje");

function mostrarMensaje(texto, color = "#d62828") {
    mensaje.textContent = texto;
    mensaje.style.color = color;
}

function limpiarMensaje() {
    mensaje.textContent = "";
}

function formatearTiempo(ms) {
    const horas = Math.floor(ms / 3600000);
    const minutos = Math.floor((ms % 3600000) / 60000);
    const segundos = Math.floor((ms % 60000) / 1000);
    const milisegundos = ms % 1000;

    return (
        String(horas).padStart(2, "0") + ":" +
        String(minutos).padStart(2, "0") + ":" +
        String(segundos).padStart(2, "0") + "." +
        String(milisegundos).padStart(3, "0")
    );
}

function actualizarPantalla() {
    pantallaCronometro.textContent = formatearTiempo(tiempoTranscurrido);
}

function renderCompetidores() {
    listaCompetidores.innerHTML = "";
    selectCompetidor.innerHTML = '<option value="">-- Seleccione --</option>';

    competidores.forEach((competidor, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${competidor.nombre}`;
        listaCompetidores.appendChild(li);

        const option = document.createElement("option");
        option.value = competidor.id;
        option.textContent = competidor.nombre;
        selectCompetidor.appendChild(option);
    });
}

function calcularResultados() {
    const competidoresConTiempo = competidores.filter(c => c.tiempo !== null);

    if (competidoresConTiempo.length === 0) {
        tablaResultados.innerHTML = "";
        return;
    }

    competidoresConTiempo.sort((a, b) => a.tiempo - b.tiempo);

    const mejorTiempo = competidoresConTiempo[0].tiempo;

    competidoresConTiempo.forEach((competidor, index) => {
        competidor.posicion = index + 1;
        competidor.diferencia = competidor.tiempo - mejorTiempo;
    });

    tablaResultados.innerHTML = "";

    competidoresConTiempo.forEach((competidor, index) => {
      const fila = document.createElement("tr");

if (index === 0) {
    fila.classList.add("primer-lugar");
}

fila.innerHTML = `
    <td>${index + 1}</td>
    <td>${competidor.nombre}</td>
    <td>${formatearTiempo(competidor.tiempo)}</td>
    <td>${competidor.diferencia === 0 ? "Primer lugar" : formatearTiempo(competidor.diferencia)}</td>
    <td>${competidor.posicion}</td>
`;

        tablaResultados.appendChild(fila);
    });
}

btnAgregar.addEventListener("click", () => {
    const nombre = nombreCompetidor.value.trim();

    if (nombre === "") {
        mostrarMensaje("Debe ingresar un nombre.");
        return;
    }

    const repetido = competidores.some(c => c.nombre.toLowerCase() === nombre.toLowerCase());

    if (repetido) {
        mostrarMensaje("Ese competidor ya fue registrado.");
        return;
    }

    const nuevoCompetidor = {
        id: Date.now().toString(),
        nombre: nombre,
        tiempo: null,
        diferencia: null,
        posicion: null
    };

    competidores.push(nuevoCompetidor);
    nombreCompetidor.value = "";
    limpiarMensaje();
    renderCompetidores();
    calcularResultados();
    mostrarMensaje("Competidor agregado correctamente.", "green");
});

btnIniciar.addEventListener("click", () => {
    if (cronometroActivo) {
        mostrarMensaje("El cronometro ya esta en ejecucion.");
        return;
    }

    limpiarMensaje();
    tiempoInicio = Date.now() - tiempoTranscurrido;

    intervalo = setInterval(() => {
        tiempoTranscurrido = Date.now() - tiempoInicio;
        actualizarPantalla();
    }, 10);

    cronometroActivo = true;
});

btnDetener.addEventListener("click", () => {
    if (!cronometroActivo) {
        mostrarMensaje("El cronometro no esta en ejecucion.");
        return;
    }

    clearInterval(intervalo);
    cronometroActivo = false;
    mostrarMensaje("Cronometro detenido.", "green");
});

btnReiniciar.addEventListener("click", () => {
    clearInterval(intervalo);
    cronometroActivo = false;
    tiempoInicio = 0;
    tiempoTranscurrido = 0;
    actualizarPantalla();
    mostrarMensaje("Cronometro reiniciado.", "green");
});

btnRegistrar.addEventListener("click", () => {
    const idSeleccionado = selectCompetidor.value;

    if (idSeleccionado === "") {
        mostrarMensaje("Debe seleccionar un competidor.");
        return;
    }

    if (tiempoTranscurrido === 0) {
        mostrarMensaje("No hay tiempo registrado en el cronometro.");
        return;
    }

    const competidor = competidores.find(c => c.id === idSeleccionado);

    if (!competidor) {
        mostrarMensaje("Competidor no encontrado.");
        return;
    }

    if (competidor.tiempo !== null) {
        mostrarMensaje("Este competidor ya tiene un tiempo registrado.");
        return;
    }

    competidor.tiempo = tiempoTranscurrido;
    calcularResultados();

    clearInterval(intervalo);
    cronometroActivo = false;
    tiempoInicio = 0;
    tiempoTranscurrido = 0;
    actualizarPantalla();

    mostrarMensaje(`Tiempo registrado para ${competidor.nombre}.`, "green");
});

actualizarPantalla();	