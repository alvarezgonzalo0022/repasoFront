window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
   const form = this.document.querySelector("form");
   const inputNombre = this.document.querySelector("#inputNombre");
   const inputApellido = this.document.querySelector("#inputApellido");
   const inputEmail = this.document.querySelector("#inputEmail");
   const inputPassword = this.document.querySelector("#inputPassword");
   const urlBase = "https://ctd-todo-api.herokuapp.com/v1";


    

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const body = {
        firstName: inputNombre.value,
        lastName: inputApellido.value,
        email: inputEmail.value,
        password: inputPassword.value
      }

      realizarRegister(body)



    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(settings) {
        const url = `${urlBase}/users`;

        const config = {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(settings)
          };

          fetch(url, config).then(res => res.json()).then(data => location.replace("/"));

    };


});