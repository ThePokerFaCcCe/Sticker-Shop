const price = document.getElementById('price');
const fullPrice = document.getElementById('full-price');
const howDeliver = document.getElementsByName('deliver');
const itemPrices = [];
for (const itp of document.getElementsByClassName("itemprice")) { itemPrices.push(itp); }

const tableRows = document.querySelectorAll("tbody tr");


function setPrice() {
    let total = 0;
    for (const itemPrice of itemPrices) {
        const tprice = parseInt(itemPrice.innerText);
        if (!isNaN(tprice)) { total += tprice; };
    }
    price.innerText = total;

    for (const deliver of howDeliver) {
        if (deliver.checked) {
            const tprice = parseInt(deliver.getAttribute("price"));
            if (!isNaN(tprice)) {
                total += tprice;
                fullPrice.innerText = total;
                return
            };
        }
    }
    fullPrice.innerText = "لطفا شیوه پرداخت را انتخاب کنید";
}

function validCount(e, itemPrice, count, oldCount, itemTotal, price, confirm) {
    const val = parseInt(count.value);
    if (val > 0 && val <= itemTotal) {
        if (val === oldCount) {
            $(confirm).fadeOut(500);
        } else {
            $(confirm).fadeIn(500);
        }
        price.innerText = val * itemPrice;
        setPrice();
    } else {
        e.preventDefault();
        count.value = oldCount;
    }
}
function remItem(item, itemId) {
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.status === 200 && req.readyState === 4) {
            if (req.responseText === "0") {
                $(item).fadeOut(200, () => {
                    item.remove();
                    itemPrices.splice(0, itemPrices.length);
                    for (const itp of document.getElementsByClassName("itemprice")) { itemPrices.push(itp); }
                    if (itemPrices.length > 0) {
                        setPrice();
                    } else {
                        location.reload(true);
                    }
                });
            }
        }

    }
    req.open("POST", '/api/cart');
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send('job=rem&itemid=' + itemId);
}

for (const item of tableRows) {
    const count = item.getElementsByClassName('count')[0],
        confirm = item.getElementsByClassName('confirm')[0],
        price = item.getElementsByClassName('itemprice')[0],
        del = item.getElementsByClassName("rem")[0],
        redo = item.getElementsByClassName("redo")[0];
    if (!count || !price || !del || !confirm) {
        console.log(item);
        continue;
    }
    const attr = {}
    const oldCount = parseInt(item.getAttribute('count')),
        itemId = parseInt(item.getAttribute('item')),
        itemTotal = parseInt(item.getAttribute('total')),
        itemPrice = parseInt(item.getAttribute('price'));
    if (isNaN(oldCount) || isNaN(itemId) || isNaN(itemTotal) || isNaN(itemPrice)) { continue; }
    attr.oldCount = oldCount

    count.onchange = (e) => { validCount(e, itemPrice, count, attr.oldCount, itemTotal, price, confirm) };
    count.onblur = (e) => { validCount(e, itemPrice, count, attr.oldCount, itemTotal, price, confirm) };

    del.onclick = () => {
        del.style.display = 'none';
        const timer = setTimeout(() => {
            remItem(item, itemId);
        }, 5000);
        redo.style.display = 'inline';
        redo.onclick = () => {
            clearInterval(timer);
            redo.style.display = 'none';
            del.style.display = 'inline';
        }
        $(redo).fadeOut(5000);
    }

    confirm.onclick = () => {
        const newCount = parseInt(count.value);
        if (itemId && !isNaN(newCount) && itemId > 0 && newCount > 0 && newCount <= itemTotal) {

            const req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                if (req.status === 200 && req.readyState === 4) {
                    switch (req.responseText) {
                        case '-2':
                            confirm.style.backgroundColor = '#ff9090'
                            break;
                        case '-1':
                            confirm.style.backgroundColor = '#ff9090'
                            break;
                        // break;
                        default:
                            attr.oldCount = parseInt(req.responseText);
                            confirm.style.backgroundColor = '#9df790'
                            $(confirm).fadeOut(500);
                            break;

                    }
                }
            }

            req.open("POST", "/api/cart");
            req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            req.send(`itemid=${itemId}&job=add&count=${newCount}`);
        }
    }
}

for (const deliver of howDeliver) {
    deliver.onchange = () => setPrice();
}

setPrice();
