const isSignUp = (window.location.pathname.indexOf("signup") !== -1);
console.log(isSignUp);
let name;
if (isSignUp) { name = document.getElementById("name"); }
const password = document.getElementById("password");
const email = document.getElementById("email");
const encpass = document.getElementById("encp");
const ul = document.getElementsByTagName('ul')[0];
function clearErrors() {
    while (ul.lastChild) {
        ul.removeChild(ul.lastChild);
    }
}
function error(err) {
    const li = document.createElement("li");
    li.innerHTML = err;
    ul.appendChild(li)
}
document.getElementsByTagName("form")[0].onsubmit = () => {
    clearErrors();
    let haveError = false;
    if (isSignUp) {
        if (name.value.length < 3 || name.value.length >= 30) {
            error("بین 3 تا 30 کلمه برای نام وارد کنید");
            name.style.border = "1px solid red";
            haveError = true
        }
    }
    if (email.value.length < 6 || email.value.length >= 50) {
        error("بین 6 تا 50 کلمه برای ایمیل وارد کنید");
        email.style.border = "1px solid red";
        haveError = true
    }
    if (password.value.length < 6) {
        error("حداقل 6 حرف برای رمز وارد کنید");
        password.style.border = "1px solid red";
        haveError = true
    }
    if (!haveError) {
        encpass.value = CryptoJS.MD5(password.value).toString();
        password.value = "";
    }
    return (haveError) ? false : true;
}