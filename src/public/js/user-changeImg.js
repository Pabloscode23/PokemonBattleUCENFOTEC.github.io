let profileImg = document.getElementById('userImg')
let inputFile = document.getElementById('input-file')
let imageSubmit = document.getElementById('image-submit')

inputFile.onchange = function () {
    imageSubmit.click();
};
