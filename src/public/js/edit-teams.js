function settings__container() {
    let show = document.getElementById("container__button");
    if (show.style.display === "none") {
        show.style.display = "block";
    } else {
        show.style.display = "none";
    }
}