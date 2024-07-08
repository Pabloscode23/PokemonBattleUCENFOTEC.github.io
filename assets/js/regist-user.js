const $formulario = document.getElementById('form');
const $inputs = document.querySelectorAll('#form input');

const expresiones = {
    nameUser: /^[a-zA-Z0-9\_\-]{4,25}$/,
    lastone: /^[a-zA-ZÀ-ÿ\s]{4,40}$/,
    name: /^[a-zA-ZÀ-ÿ\s]{4,40}$/,
    lasttwo: /^[a-zA-ZÀ-ÿ\s]{4,40}$/,
    email: /^[a-zA-Z0-9\_]+@[a-zA-Z]+\.[a-zA-Z]{1,8}$/,
    id: /^\d{6,12}$/,
}

const campos = {
    nameUser: false,
    lastone: false,
    name: false,
    lasttwo: false,
    email: false,
    id: false
}
const validarFormulario = (e) => {
    switch (e.target.name) {
        case "nameUser":
            validarCampo(expresiones.nameUser, e.target, "nameUser");
            break;
        case "lastone":
            validarCampo(expresiones.lastone, e.target, "lastone");
            break;
        case "name":
            validarCampo(expresiones.name, e.target, "name");
            break;
        case "lasttwo":
            validarCampo(expresiones.lasttwo, e.target, "lasttwo");
            break;
        case "email":
            validarCampo(expresiones.email, e.target, "email");
            break;
        case "id":
            validarCampo(expresiones.id, e.target, "id");
            break;
    }
}
const validarCampo = (expresion, input, campo) => {


    if (expresion.test(input.value)) {
        document.getElementById(`form__${campo}`).classList.remove("form__incorrect");
        document.getElementById(`form__${campo}`).classList.add("form__correct");
        document.querySelector(`#form__${campo} i`).classList.remove("bx-x-circle");
        document.querySelector(`#form__${campo} i`).classList.add("bx-check-circle");
        document.querySelector(`#form__${campo} .form__input-error`).classList.remove("form__input-error--active");
        campos[campo] = true;
    } else {
        document.getElementById(`form__${campo}`).classList.add("form__incorrect");
        document.getElementById(`form__${campo}`).classList.remove("form__correct");
        document.querySelector(`#form__${campo} i`).classList.add("bx-x-circle");
        document.querySelector(`#form__${campo} i`).classList.remove("bx-check-circle");
        document.querySelector(`#form__${campo} .form__input-error`).classList.add("form__input-error--active");
        campos[campo] = false;

    }
}

$inputs.forEach((input) => {
    input.addEventListener("keyup", validarFormulario);
    input.addEventListener("blur", validarFormulario);
});

$formulario.addEventListener("submit", (e) => {

    e.preventDefault()

    if (campos.name && campos.nameUser && campos.id && campos.email && campos.lastone && campos.lasttwo) {

        document.getElementById("bottom__fail").classList.remove("bottom__fail--active");

        document.getElementById("bottom__valid").classList.add("bottom__valid--active");

        setTimeout(() => {
            location.reload();
            window.location.href = "../html/login.html";
        }, 4000);

    } else {
        document.getElementById("bottom__msj").classList.add("bottom__fail--active");
    }
});
