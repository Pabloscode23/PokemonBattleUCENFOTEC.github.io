document.addEventListener('DOMContentLoaded', function () {
    const resetButton = document.querySelector('.button__reset');
    const teamNameInput = document.getElementById('team__name-title');
    const checkIcon = document.getElementById('checkIcon');
    const teamNameError = document.getElementById('teamNameError');
    const teamForm = document.getElementById('teamForm');
    const messageContainer = document.getElementById('messageContainer');

    resetButton.addEventListener('click', () => {
        teamNameInput.value = '';
        validateTeamName();
    });

    teamNameInput.addEventListener('input', function () {
        validateTeamName();
    });

    /*teamForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (validateTeamName()) {
            const formData = new FormData(teamForm);
            fetch('/create-teams', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage('Equipo guardado correctamente.', 'success-message');
                } else {
                    showMessage('Error al guardar el equipo.', 'error-message');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('Error al guardar el equipo.', 'error-message');
            });
        }
    });
*/
    function validateTeamName() {
        const teamName = teamNameInput.value.trim();
        if (teamName.length < 5) {
            teamNameError.textContent = 'El nombre del equipo debe tener al menos 5 caracteres.';
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

    function showMessage(message, className) {
        messageContainer.textContent = message;
        messageContainer.className = className;
    }
});
