function enviar() {
    var correo = document.getElementById('correo').value;
    if (!correo.includes('@') || !correo.includes('.')) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El correo debe contener un @ y una extensión de dominio válida',
        });
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Correo Enviado',
            text: 'Se te ha enviado un código de recuperación a tu correo electrónico',
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "login"
            }
        });
    }
}
