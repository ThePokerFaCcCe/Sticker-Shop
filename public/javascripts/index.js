const navTop = document.querySelector(".nav-top")


function phoneUL() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width < 650) {
        navTop.style.display = "none";
        document.querySelectorAll(".nav-top-items li").forEach((li) => {
            li.onclick = () => {
                const children = li.childNodes;
                children.forEach((v) => { if (v.nodeName === "UL") { v.classList.toggle("hidden"); } })

            };
        });
    } else {
        navTop.style.display = "block";
        document.querySelectorAll(".nav-top-items li").forEach((li) => {
            li.onclick = null;
            const children = li.childNodes;
            children.forEach((v) => { if (v.nodeName === "UL") { v.classList.add("hidden"); } })
        });
    }
};



document.body.onload = () => { phoneUL(); }
document.body.onresize = () => { phoneUL(); }
document.querySelector(".nav-top-button.open").onclick = () => navTop.style.display = "block";
document.querySelector(".nav-top-button.close").onclick = () => navTop.style.display = "none";