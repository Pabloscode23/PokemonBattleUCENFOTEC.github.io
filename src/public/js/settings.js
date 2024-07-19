//función del boton permitir
function allow() {
    let permitir = document.getElementById("permit").value;
    const minLength = 3;
    const maxLength = 11;

    if (permitir == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'El espacio esta vacio.',
        });
    } else if (permitir.length < minLength) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No hay un nombre pokémon con un nombre tan corto.',
        });
    } else if (permitir.length > maxLength) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No hay un pokémon con un nombre tan largo',
        });
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Permision correcta',
            text: 'El pokémon a sido permitido exitosamente',
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "settings.html"
            }
        });
    }

}

//función del boton prohibir
function ban() {
    let prohibir = document.getElementById("prohibir").value;
    const minLength = 3;
    const maxLength = 11;

    if (prohibir == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'El espacio esta vacio.',
        });
    } else if (prohibir.length < minLength) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No hay un nombre pokémon con un nombre tan corto.',
        });
    } else if (prohibir.length > maxLength) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No hay un pokémon con un nombre tan largo',
        });
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Prohibición correcta',
            text: 'El pokémon a sido prohibido exitosamente',
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "settings.html"
            }
        });
    }

}
