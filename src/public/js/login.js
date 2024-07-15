function enviar() {
    var usuario = document.getElementById("usuario").value;
    var contraseña = document.getElementById("contraseña").value;
    const minLength = 6;
    const maxLength = 14;
    if (usuario == "" || contraseña == "") {
        Swal.fire({
            icon: 'error',
            title: 'Información Incompleta',
            text: 'Debes ingresar tus datos',
        });
    } else if (usuario.length < minLength) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Este usuario no existe',
        });
    } else if (usuario.length > maxLength) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Este usuario no existe',
        });
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Información Válida',
            text: 'Iniciando Sesión',
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "user-profile"
            }
        });
    }
}