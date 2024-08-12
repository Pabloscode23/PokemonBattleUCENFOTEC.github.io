function validateAll(event) {
    if (!validateTeamSlots() || !validateTeamName() || !validateUniquePokemonNames()) {
        event.preventDefault();
        showMessage('Debe ingresar los nombres de los seis Pokémones sin caracteres especiales, y no puede haber nombres repetidos.', 'error-message');
        return false;
    } else {
        showMessage('Formulario enviado correctamente.', 'success-message');
        return true;
    }
}

function validateTeamName() {
    const teamNameInput = document.getElementById('team__name-title');
    const teamNameError = document.getElementById('teamNameError');
    const teamName = teamNameInput.value.trim();
    const specialCharPattern = /[^a-zA-Z0-9\s]/;

    if (teamName.length < 4) {
        teamNameError.textContent = 'El nombre del equipo debe tener al menos 4 caracteres.';
        teamNameError.classList.add('error-message');
        teamNameError.classList.remove('success-message');
        teamNameInput.classList.remove('valid');
        teamNameInput.classList.add('invalid');
        return false;
    } else if (specialCharPattern.test(teamName)) {
        teamNameError.textContent = 'El nombre del equipo no debe contener caracteres especiales.';
        teamNameError.classList.add('error-message');
        teamNameError.classList.remove('success-message');
        teamNameInput.classList.remove('valid');
        teamNameInput.classList.add('invalid');
        return false;
    } else {
        teamNameError.textContent = 'Nombre válido.';
        teamNameError.classList.remove('error-message');
        teamNameError.classList.add('success-message');
        teamNameInput.classList.remove('invalid');
        teamNameInput.classList.add('valid');
        return true;
    }
}

function validatePokemonName(slot) {
    const pokemonName = slot.value.trim();
    const specialCharPattern = /[^a-zA-Z0-9\s]/;
    if (specialCharPattern.test(pokemonName)) {
        slot.classList.add('invalid');
        slot.classList.remove('valid');
        return false;
    } else {
        slot.classList.remove('invalid');
        slot.classList.add('valid');
        return true;
    }
}

function validateTeamSlots() {
    const teamSlots = document.querySelectorAll('.team__slot');
    let valid = true;
    teamSlots.forEach(slot => {
        if (slot.value.trim() === '' || !validatePokemonName(slot)) {
            valid = false;
            slot.classList.add('invalid');
        } else {
            slot.classList.remove('invalid');
            slot.classList.add('valid');
        }
    });
    return valid;
}

function validateUniquePokemonNames() {
    const teamSlots = document.querySelectorAll('.team__slot');
    const names = [];
    let unique = true;
    teamSlots.forEach(slot => {
        const name = slot.value.trim();
        if (names.includes(name)) {
            slot.classList.add('invalid');
            unique = false;
        } else {
            names.push(name);
            slot.classList.remove('invalid');
            slot.classList.add('valid');
        }
    });
    if (!unique) {
        showMessage('No se permiten nombres de Pokémon repetidos.', 'error-message');
    }
    return unique;
}

function showMessage(message, className) {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.textContent = message;
    messageContainer.className = `message-container ${className}`;
}

function resetTeamName() {
    const teamNameInput = document.getElementById('team__name-title');
    teamNameInput.value = '';
    validateTeamName();
    showMessage('', ''); // Limpia mensaje existente
}
