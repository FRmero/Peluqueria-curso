let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    // Resalta div actual según el tab que se presiona
    mostrarSeccion();

    // Oculta o muestra una sección según al tab al que se presiona
    cambiarSeccion();

    // Paginacion siguiente y anterior
    paginaSiguiente();

    paginaAnterior();

    // Comprueba página actual para ocultar la paginación
    botonesPaginador();

    // Resumen de la cita | Mensaje de error
    mostrarResumen();

    // Almacena el nombre de la cita en el objeto
    nombreCita();

    // Almacenar la fecha de la cita en el objeto
    fechaCita();

    // Deshabilitar fechas pasadas
    fechasAnteriores();

    // Almacena la hora de la cita en el obj
    horaCita();
}

function mostrarSeccion() {

    // Eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }
    

    
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
    

    // Resalta tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`); // Va entre corchetes porque es un atributo
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            // Llamar la función de mostrar sección
            mostrarSeccion();
            botonesPaginador();
        })
    })
}

/* Servicios */
async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();

        const  { servicios } = db;

        // Generar HTML
        servicios.forEach( servicio => {
            const { id, nombre, precio } = servicio;

           // DOM Scripting
           // Generar nombre del servicio
           const nombreServicio = document.createElement('P');
           nombreServicio.textContent = nombre;
           nombreServicio.classList.add('nombre-servicio');

           // Generar precio del servicio
           precioServicio = document.createElement('P');
           precioServicio.textContent = `$ ${precio}`;
           precioServicio.classList.add('precio-servicio')

           // Generar div contenedor servicio
           const servicioDiv = document.createElement('DIV')
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            // Seleccionar servicios
            servicioDiv.onclick = seleccionarServicio; //onclick es un eventhandler. Se utiliza mayormente en código creado en JS, mientras que addeventlistener en código ya existente.

            // Agregar precio y nombre al contenedor
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            // Agregar al HTML
            document.querySelector('#servicios').appendChild(servicioDiv);
        });

    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {
    let elemento;
    // Forzar que el elemento al cual damos click sea el DIV
    if(e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
       elemento = e.target;
    }
    
    if(elemento.classList.contains('seleccionado')){
            elemento.classList.remove('seleccionado');

            const id = parseInt( elemento.dataset.idServicio );

            eliminarServicio(id);
        } else {
            elemento.classList.add('seleccionado');

            
            const servicioObj = {
                id: parseInt( elemento.dataset.idServicio ),
                nombre: elemento.firstElementChild.textContent,
                precio: elemento.firstElementChild.nextElementSibling.textContent
            }
        
            agregarServicio(servicioObj);
        } 
}

function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter( servicio => servicio.id !== id);

    console.log(cita);
}

function agregarServicio(servicioObj) {
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj];

    console.log(cita);
}

/* Paginacion */
function paginaSiguiente() {
    const paginaSiguiente = document.querySelector("#siguiente");
    paginaSiguiente.addEventListener('click', () => {
        pagina++;

        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector("#anterior");
    paginaAnterior.addEventListener('click', () => {
        pagina--;

        botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector("#siguiente");
    const paginaAnterior = document.querySelector("#anterior");

    if(pagina === 1 ) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

function mostrarResumen() {
    // Destructuring
    const {nombre, fecha, hora, servicios} = cita;

    // Seleccionar resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    // Limpiar HTML previo
    while ( resumenDiv.firstChild ) {
        resumenDiv.removeChild( resumenDiv.firstChild );
    }


    // Validación de objeto
    if(Object.values(cita).includes('')) {
       const noServicios = document.createElement('P');
       noServicios.textContent = 'Faltan rellenar datos: Hora, Fecha o Nombre'
       noServicios.classList.add('invalidar-cita');

       

       // agregar a resumenDiv
       resumenDiv.appendChild(noServicios);

       return;
    }


    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    // Mostrar resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios)

    let cantidad = 0;

    // Iterar sobre el array de servicios
    servicios.forEach( servicio => {

        const { nombre, precio } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');
        cantidad += parseInt(totalServicio[1].trim());

        // Colocar texto y precio en el DIV
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);
    } )

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a pagar:</span> $ ${cantidad}`;

    resumenDiv.appendChild(cantidadPagar);
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();
        
        // Valideación que nombreTexto debe tener caracteres

        if(nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('Nombre no valido', 'error');
        } else {
            const alerta = document.querySelector('.alerta');
            if(alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    });
}

function mostrarAlerta(mensaje, tipo) {

    // Solo mostrar UNA alerta
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if( tipo === 'error' ) {
        alerta.classList.add('error');
    }

    // Colocar en el HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    // Eliminar alerta luego de 3sec
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e =>  {

        const dia = new Date(e.target.value).getUTCDay();
        
        if([0, 6].includes(dia)){
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de semana no validos', 'error');
        } else {
            cita.fecha = fechaInput.value;

            console.log(cita);
        }

    });
}

function fechasAnteriores() {
    const inputFecha = document.querySelector("#fecha");

    const fechaHoy = new Date();
    const year = fechaHoy.getFullYear();
    const mes = fechaHoy.getMonth() + 1;
    const dia = fechaHoy.getDate() + 1;

    const fechaDeshabilitar = `${year}-${mes < 10 ?  `0${mes}`: mes }-${dia <10 ? `0${dia}`:dia}`;

    inputFecha.min = fechaDeshabilitar;
    
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {

        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if(hora[0] < 10 || hora[0] > 20) {
            mostrarAlerta('Hora no valida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 3000);
            
        } else {
           cita.hora = horaCita;

           console.log(cita);
        }
    });
}