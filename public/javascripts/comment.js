function remAnim(tr) {
    $(tr).fadeOut(500, () => {
        tr.remove();
    });
}

function addMsg(type, text) {
    const li = document.createElement('li');
    li.innerText = text;
    li.classList.add(type);
    li.style.display = "none";
    msgs.appendChild(li);
    $(li).fadeIn(600).delay(2000).fadeOut(300, () => { li.remove(); });
}


function accReq(tr, cid) {
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState === 4) {
            switch (req.status) {
                case 200:
                    remAnim(tr);
                    addMsg('msg', JSON.parse(req.responseText).msg);
                    break;
                default:
                    addMsg('err', JSON.parse(req.responseText).error);
                    break;
            }
        }

    };
    req.open("POST", '/admin/comment/accept');
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send('id=' + cid);
}

function delReq(tr, cid) {
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState === 4) {
            switch (req.status) {
                case 200:
                    remAnim(tr);
                    addMsg('msg', JSON.parse(req.responseText).msg);
                    break;
                default:
                    addMsg('err', JSON.parse(req.responseText).error);
                    break;
            }
        }

    };
    req.open("POST", '/admin/comment/delete');
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send('id=' + cid);
}

function eaccReq(index, text, cid) {
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState === 4) {
            switch (req.status) {
                case 200:
                    remAnim(Accepts1[index].parentElement.parentElement);
                    $(popup).fadeOut(300);
                    clearPopup();
                    addMsg('msg', JSON.parse(req.responseText).msg);
                    break;
                default:
                    addMsg('err', JSON.parse(req.responseText).error);
                    break;
            }
        }

    };
    req.open("POST", '/admin/comment/edit');
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send('id=' + cid + "&text=" + text);
}



function clearPopup() {
    newComment.value = "";
    newComment.removeAttribute("cid");
    newComment.removeAttribute("index");
}

const msgs = document.getElementById("msgs");
const popup = document.getElementById('popup');
const newComment = document.getElementById('new-comment');
const bEacc = document.getElementById('p-eacc');
const bCancel = document.getElementById('p-cancel');


const Accepts1 = document.getElementsByClassName("c-acc");
const Accepts2 = document.getElementsByClassName("c-accS");

const Eaccepts = document.getElementsByClassName("c-eacc");

const Deletes1 = document.getElementsByClassName("c-del");
const Deletes2 = document.getElementsByClassName("c-delS");


for (let i = 0; i < Eaccepts.length; i++) {
    const acc = Accepts1[i];
    const accS = Accepts2[i];

    const del = Deletes1[i];
    const delS = Deletes2[i];

    const eacc = Eaccepts[i];

    const tr = eacc.parentElement.parentElement;
    const cid = eacc.getAttribute('cid');
    const comment = tr.getElementsByClassName('c-text')[0].innerText;

    eacc.onclick = () => {
        clearPopup();
        $(popup).fadeIn(400, () => { popup.style.display = 'flex'; });

        newComment.value = comment;
        newComment.setAttribute("cid", cid);
        newComment.setAttribute("index", i);
    };
    try {
        acc.onclick = () => {
            acc.style.display = 'none';
            accS.style.display = 'block';

            setTimeout(() => {
                try {
                    accS.style.display = 'none';
                    acc.style.display = 'block';
                } catch { }
            }, 3000);
        };

        accS.onclick = () => {
            accReq(tr, cid);
        };
    } catch { }
    try {
        del.onclick = () => {
            del.style.display = 'none';
            delS.style.display = 'block';

            setTimeout(() => {
                try {
                    delS.style.display = 'none';
                    del.style.display = 'block';
                } catch { }
            }, 3000);
        };

        delS.onclick = () => {
            delReq(tr, cid);
        };
    } catch { }

}


bCancel.onclick = () => {
    $(popup).fadeOut(400);
    clearPopup();
};

bEacc.onclick = () => {
    eaccReq(
        newComment.getAttribute('index'),
        newComment.value,
        newComment.getAttribute('cid')
    );
};

// del.onclick = () => {
//     del.style.display = 'none';
//     const timer = setTimeout(() => {
//         remItem(item, itemId);
//     }, 5300);
//     redo.style.display = 'inline';
//     redo.onclick = () => {
//         clearInterval(timer);
//         redo.style.display = 'none';
//         del.style.display = 'inline';
//     };
//     $(redo).fadeOut(5000);
// };