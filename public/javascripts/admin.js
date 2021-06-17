const fileinput = document.querySelectorAll('input[type="file"]');
const filelabel = document.querySelectorAll('label#file');
const filePrev = document.querySelectorAll("img.file");
function showImage(input, reader) {
    
    if (input.files && input.files[0]) {
        reader.readAsDataURL(input.files[0]);
    }
}
for (let i = 0; i < fileinput.length; i++) {
    const reader = new FileReader();
    reader.onload = (e) => {
        filePrev[i].setAttribute("src", e.target.result);
    }

    fileinput[i].onchange = () => {
        filelabel[i].innerHTML = fileinput[i].files[0].name;
        showImage(fileinput[i], reader);
    }
}