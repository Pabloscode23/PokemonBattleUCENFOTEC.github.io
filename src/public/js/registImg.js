let profileImg = document.getElementById('userImg')
let inputFile = document.getElementById('input-file')

inputFile.onchange = function () {
    profileImg.src = URL.createObjectURL(inputFile.files[0])
}
