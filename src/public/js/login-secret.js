let passwordInput = document.querySelector("#contraseña");

passwordInput.addEventListener('input', functionPassword3)
function functionPassword3() {
    passwordInput.type = "text"
    setTimeout(() => {
        passwordInput.type = 'password'
    }, 300);
}