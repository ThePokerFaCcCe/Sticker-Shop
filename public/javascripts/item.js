const itembox = document.getElementsByClassName('item')[0],
    itemCount = document.getElementById('add-count'),
    itemTotal = parseInt(itembox.getAttribute('total')),
    itemId = parseInt(itembox.getAttribute('id')),
    guestMsg = document.getElementById('add-guest'),
    errorMsg = document.getElementById('add-error'),
    successMsg = document.getElementById('add-success');


document.getElementById('add-cart').onclick = () => {
    const count = parseInt(itemCount.value);
    if (itemId && count && itemId > 0 && count > 0 && count <= itemTotal) {
        // $(successMsg).fadeIn(500).delay(1000).fadeOut(600);

        const req = new XMLHttpRequest();
        req.onreadystatechange = () => {
            if (req.status === 200 && req.readyState === 4) {
                console.log(req.responseText);
                switch (req.responseText) {
                    case '-2':
                        $(guestMsg).slideDown(500).delay(1000).slideUp(600);
                        break;
                    case '-1':
                        $(errMsg).slideDown(500).delay(1000).slideUp(600);
                        break;
                    // break;
                    default:
                        $(successMsg).slideDown(500).delay(1000).slideUp(600);
                        break;

                }
            } else {
                // $(errorMsg).slideDown(500).delay(1500).slideUp(600);
            }
        }

        req.open("POST", "/api/cart");
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send(`itemid=${itemId}&job=add&count=${count}`);
    }
}

const jobs = document.querySelectorAll(".ad-work a");
for (const a of jobs) {
    const params = { prevent: true };
    a.onclick = (e) => {
        if (params.prevent) {
            e.preventDefault();
            a.style.color = "#f1f1f1"
            params.prevent = false;
            setTimeout(() => { params.prevent = true; a.style.color = "#000" }, 3000)
        }
    }
}

const addComment = document.getElementById('add-comment'),
    comment = document.getElementById('new-comment'),
    replyId = document.getElementById("replyto"),
    // itemIdComment = document.getElementById('itemid'),
    replies = document.getElementsByClassName("comment-reply"),
    cparams = {};
for (const reply of replies) {
    const commentBox = reply.parentElement.parentElement,
        commentId = commentBox.id;
    reply.onclick = () => {
        if (cparams.commentBox) {
            cparams.commentBox.classList.remove('reply');
        }
        if (cparams.reply === reply) {
            cparams.reply = null;
            cparams.commentBox.classList.remove('reply');
            cparams.commentBox = null;
            replyId.value = 0;
        } else {
            cparams.reply = reply;
            cparams.commentBox = commentBox;
            commentBox.classList.add("reply");
            replyId.value = commentId;
        }
    }
}
addComment.onsubmit = () => {
    comment.value = comment.value.trim();
    if (comment.value.length > 2 && comment.value.length < 120) {
        // itemIdComment.value = itemId;
        return true
    } else {
        return false
    }
}