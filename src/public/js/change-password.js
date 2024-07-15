function cambiar() {
    let password1 = document.getElementById("currentPassword").value;
    let password2 = document.getElementById("newPassword").value;
    let password3 = document.getElementById("confirmPassword").value;
    const minLength = 6;
    const maxLength = 14;
    if (password1 == "" || password2 == "" || password3 == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'Debe completar todos los espacios',
        });
    } else if (password1.length < minLength) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La contraseña debe de tener minimo 6 caracteres o información inválida',
        });
    } else if (password1.length > maxLength) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La contraseña debe de tener maximo 14 caracteres o información inválida',
        });
    } else if (password2.length < minLength) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La contraseña debe de tener minimo 6 caracteres o información inválida',
        });
    } else if (password2.length > maxLength) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La contraseña debe de tener maximo 15 caracteres o información inválida',
        });
    } else if (password3.length < minLength) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La contraseña debe de tener minimo 6 caracteres o información inválida',
        });
    } else if (password3.length > maxLength) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La contraseña debe de tener maximo 14 caracteres o información inválida',
        });
    } else if (password2 !== password3) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ambas contraseñas deben ser iguales',
        });
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Información Valida',
            text: 'La contraseña se cambio correctamente',
        });
    }
}

document.getElementById('confirmPassword').addEventListener('input', function () {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword === confirmPassword) {
        this.style.borderColor = '#04F513';
    } else {
        this.style.borderColor = '#E52017';
    }
});
