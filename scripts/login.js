(function chequeo(){
  
    const jwt = localStorage.getItem("jwt");
    
    if(jwt){
      location.replace("/mis-tareas.html")
    }
    })()

window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
   
    const form = this.document.querySelector("form");   
    const inputEmail = this.document.querySelector("#inputEmail");
    const inputPassword = this.document.querySelector("#inputPassword");
    const urlBase = "https://ctd-todo-api.herokuapp.com/v1"



    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
        event.preventDefault();

       const body = {
        email: inputEmail.value,
        password: inputPassword.value,
       }

       realizarLogin(body)

    });


    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarLogin(settings) {
        const url = `${urlBase}/users/login`;
        

        const config = {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(settings)
           }
        
           fetch(url, config).then(res => res.json()).then(data =>{
            location.replace("/mis-tareas.html");
            localStorage.setItem("jwt", data.jwt)});

       
    }
});