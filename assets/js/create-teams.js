document.addEventListener('DOMContentLoaded', function () {
    const resetButton = document.querySelector('.button__reset');
    const teamNameInput = document.getElementById('team__name-title');
    const checkIcon = document.getElementById('checkIcon');
    const teamNameError = document.getElementById('teamNameError');

    resetButton.addEventListener('click', () => {
        teamNameInput.value = '';
        validateTeamName();
    });

    teamNameInput.addEventListener('input', function () {
        validateTeamName();
    });

    function validateTeamName() {
        const teamName = teamNameInput.value.trim();
        if (teamName.length < 5) {
            teamNameError.textContent = 'El nombre del equipo debe tener al menos 5 caracteres.';
            teamNameError.classList.add('error-message');
            teamNameError.classList.remove('success-message');
            team__name - title.classList.remove('valid');
            team__name - title.classList.add('invalid');
            return false;
        } else {
            teamNameError.textContent = 'Nombre válido.';
            teamNameError.classList.remove('error-message');
            teamNameError.classList.add('success-message');
            team__name - title.classList.remove('invalid');
            team__name - title.classList.add('valid');
            return true;
        }
    }

});
