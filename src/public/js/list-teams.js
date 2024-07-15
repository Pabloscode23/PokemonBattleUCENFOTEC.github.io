document.addEventListener('DOMContentLoaded', function () {
    const playerInfoButton = document.querySelector('.button__player-info');
    playerInfoButton.addEventListener('click', function () {
        window.location.href = 'friends-profile';
    });
});
