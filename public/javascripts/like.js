const sliderItems = document.getElementsByClassName('slider-item') || [];
for (const item of sliderItems) {
    const itemID = item.getAttribute('item_id');


    const likeBtn = item.getElementsByClassName('icon-heart')[0];
    const likeCount = likeBtn.getElementsByClassName('slider-item-likes-count')[0];
    likeBtn.onclick = () => {
        const lastCount = likeCount.innerText;
        likeCount.innerText = '...'
        const req = new XMLHttpRequest()
        req.onreadystatechange = () => {
            if (req.status === 200 && req.readyState === 4) {
                const newCount = req.responseText;
                if (newCount !== "-1") {
                    likeCount.innerText = newCount;
                    item.setAttribute("like", newCount)
                    likeBtn.classList.toggle("liked")
                    return
                }
            }
            likeCount.innerText = lastCount

        }
        req.open("POST", '/api/like');
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send('itemid=' + itemID);
    }


    const addCart = item.getElementsByClassName('slider-item-addcart')[0];
    addCart.onclick = () => {
        const req = new XMLHttpRequest();
        const lastText = addCart.innerText;
        addCart.innerText = '...'
        req.onreadystatechange = () => {
            if (req.status === 200 && req.readyState === 4) {
                newText = req.responseText;
                if (newText !== "-1") {
                    addCart.innerText = newText;
                    return
                }
            }
            addCart.innerText = lastText;

        }
        req.open("POST", '/api/cart');
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send('job=add&itemid=' + itemID);
    }
}