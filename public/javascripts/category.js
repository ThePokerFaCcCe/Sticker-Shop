// SELECT: needed
const itemsBox = document.getElementsByClassName("cat-items")[0];
const items = document.getElementsByClassName("cat-item");

const sortSelect = document.getElementById('cat-sortby');

const priceSubmit = document.getElementById('submit-price');
const priceLower = document.getElementById('lower-price');
const priceHigher = document.getElementById('higher-price');

const searchInput = document.getElementById('scat');

const resultCount = document.querySelector(".cat-head-result-count span");
// /* */ // // /* */ // // /* */ // // /* */ // // /* */ // // /* */ // // /* */ //

// SHOW: count items
function _countItems() {
    let showedItems = 0
    for (const item of items) {
        if (item.style.display !== 'none') {
            showedItems++;
        }
    }
    resultCount.innerHTML = showedItems;
}
function countItems() {
    setTimeout(() => _countItems(), 500);
}
countItems();

// /* */ // // /* */ // // /* */ // // /* */ // // /* */ // // /* */ // // /* */ //

// FILTER: search items
// searchSubmit.onclick
searchInput.onkeyup = () => {
    const searchText = searchInput.value;
    if (searchText.length > 0) {
        for (const item of items) {
            //getElementsByClassName('slider-item-name')[0].innerText
            const itemName = item.getAttribute("item_name");
            if (itemName.indexOf(searchText) !== -1) {
                $(item).show(200);
            } else {
                $(item).hide(200);
            }
        }
    } else {
        for (const item of items) {
            $(item).show(200);
        }
    }
    countItems();
};

// /* */ // // /* */ // // /* */ // // /* */ // // /* */ // // /* */ // // /* */ //

// FILTER: price items
priceSubmit.onclick = () => {
    const lp = parseInt(priceLower.value);
    const hp = parseInt(priceHigher.value);
    if (lp > hp) {
        priceHigher.value = lp
    }
    else if (hp < lp) {
        priceLower.value = hp
    }
    for (const item of items) {
        //getElementsByClassName('slider-item-price')[0].innerText
        const itemPrice = parseInt(item.getAttribute("price"));
        if (itemPrice <= hp && itemPrice >= lp) {
            $(item).show(200);
        } else {
            $(item).hide(200);
        }
    }
    countItems();
};

// /* */ // // /* */ // // /* */ // // /* */ // // /* */ // // /* */ // // /* */ //

// FILTER: sort items
sortSelect.onchange = () => {
    const sort = sortSelect.value;
    // const olditems = items;
    const newitems = []
    for (const item of items) { newitems.push(item) }

    switch (sort) {
        case 'low':
            newitems.sort((x, y) => parseInt(x.getAttribute("price")) - parseInt(y.getAttribute("price")))
            break;
        case 'high':
            newitems.sort((x, y) => parseInt(y.getAttribute("price")) - parseInt(x.getAttribute("price")))
            break;
        case 'love':
            newitems.sort((x, y) => parseInt(y.getAttribute("like")) - parseInt(x.getAttribute("like")))
            break;
        case 'new':
            newitems.sort((x, y) => parseInt(y.getAttribute("date")) - parseInt(x.getAttribute("date")))
            break;

        default:
            break;
    }
    while (itemsBox.lastChild) {
        itemsBox.removeChild(itemsBox.lastChild);
    }
    for (const item of newitems) {
        itemsBox.appendChild(item);
    }
}

// /* */ // // /* */ // // /* */ // // /* */ // // /* */ // // /* */ // // /* */ //
