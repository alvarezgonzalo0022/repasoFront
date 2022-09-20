// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.

(function chequeo(){
  
const jwt = localStorage.getItem("jwt");

if(!jwt){
  location.replace("/")
}
})()


/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {

  /* ---------------- variables globales y llamado a funciones ---------------- */
  const nodoNombreUsuario = this.document.querySelector(".user-info p");
  const btnCerrarSesion = this.document.querySelector("#closeApp");
  const formCrearTarea = this.document.querySelector(".nueva-tarea");
  const inputCrearTarea = this.document.querySelector("#nuevaTarea")
  const cantidadTareasFinalizadas = this.document.querySelector("#cantidad-finalizadas");
  const URLBASE = "https://ctd-todo-api.herokuapp.com/v1";
  const JWT = localStorage.getItem("jwt");
  const contenedorTareasPendientes = this.document.querySelector(".tareas-pendientes");
  const contenedorTareasTerminadas = this.document.querySelector(".tareas-terminadas");


  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener('click', function () {
   localStorage.clear();
   location.replace("/");

  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
   const url = `${URLBASE}/users/getMe`;

   const config = {
    method: "GET",
    headers: {
      authorization: JWT
    }
   }

   fetch(url, config).then(res => res.json()).then(data => nodoNombreUsuario.textContent = data.firstName);

  };
  obtenerNombreUsuario();


  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
  const url = `${URLBASE}/tasks`;

   const config = {
    method: "GET",
    headers: {
      authorization: JWT
    }
   }
   
   fetch(url,config).then(res => res.json()).then(data => {
    renderizarTareas(data)
    cantidadTareasFinalizadas.textContent = data.filter(tarea => tarea.completed).length
  });


  };
  consultarTareas();

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', function (event) {
    event.preventDefault;
    const url = `${URLBASE}/tasks`;

    const body = {
      description: inputCrearTarea.value,
      completed: false
    }

    const config = {
      method: "POST",
      headers: {
        authorization: JWT,
        "Content-type": "application/json"
      },
      body: JSON.stringify(body)
    }

    fetch(url, config).then(res => res.json()).then(data => consultarTareas())




  });


  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {

    const listadoPendientes = listado.filter(tarea => !tarea.completed);
    const listadoTerminadas = listado.filter(tarea => tarea.completed);

    contenedorTareasPendientes.innerHTML = "";
    contenedorTareasTerminadas.innerHTML = "";



    listadoPendientes.forEach( tarea => {
      // por cada tarea inyectamos un nodo li
      contenedorTareasPendientes.innerHTML += `
      <li class="tarea" data-aos="fade-down">
        <button class="change" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
        <div class="descripcion">
          <p class="nombre">${tarea.description}</p>
          <p class="timestamp">${tarea.createdAt}</p>
        </div>
      </li>
      `
    })
    
    listadoTerminadas.forEach( tarea => {
      // por cada tarea inyectamos un nodo li
      contenedorTareasTerminadas.innerHTML += `
      <li class="tarea" data-aos="fade-up">
        <div class="hecha">
          <i class="fa-regular fa-circle-check"></i>
        </div>
        <div class="descripcion">
          <p class="nombre">${tarea.description}</p>
          <div class="cambios-estados">
            <button class="change incompleta" id="${tarea.id}" ><i class="fa-solid fa-rotate-left"></i></button>
            <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </div>
      </li>
      `
    })
    


    botonesCambioEstado();
    botonBorrarTarea();
  };

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {
    const botonesChange = this.document.querySelectorAll(".change");

    botonesChange.forEach(boton => {

      boton.addEventListener("click", function(){
        
        const terminada = boton.classList.contains("incompleta");

        const url = `${URLBASE}/tasks/${boton.id}`;

        const config = {
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
            authorization: JWT,
          },
          body: JSON.stringify({
            completed: !terminada,
          })
        }

        fetch(url, config).then(res => res.json()).then(data => consultarTareas())
      })
    })
    



  }


  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {
   const botonesBorrar = document.querySelectorAll(".borrar");

   botonesBorrar.forEach(boton => {
    boton.addEventListener("click", function(){
      const url = `${URLBASE}/tasks/${boton.id}`;

      const config = {
      method: "DELETE",
      headers: {
        authorization: JWT
      }
    }

    fetch(url, config).then(res => res.json()).then(consultarTareas())
    })
   })

  };

});

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 8 - Actualizar numero de tareas                    */
  /* -------------------------------------------------------------------------- */

  a