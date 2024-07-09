function send() {
    var user = document.getElementById("user").value;
    var mail = document.getElementById("mail").value;
    const minLength = 5;
    const maxLength = 10;
    if (user == "" || mail == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'Debe de completar la información solicitada.',
        });
    } else if (user.length < minLength) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El Nombre debe contener de 5 a 10 caracteres, puede tener números y simbolos.',
        });
    } else if (user.length > maxLength) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El Nombre de usuario excede la cantidad de caracteres permitidos.',
        });
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Registro Valida.',
            text: 'Su registro se a realizado correctamente.',
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "search-friends.html"
            }
        });
    }
}

