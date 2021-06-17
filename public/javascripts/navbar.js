/* FADE IN - OUT FUNCTIONS */

function showItem(
    itemType,
    item,
    index,
    { fadeinT, delayShow, fadeoutT, delayToNext }
) {
    $(item)
        .delay(delayToNext)
        .fadeIn(fadeinT)
        .delay(delayShow)
        .fadeOut(fadeoutT, () => getNext(itemType, index));
}

/**
 *
 * @param {int} itemType 1: nav-static msgs & 2: header pics
 * @param {int} currentIndex
 */
function getNext(itemType, currentIndex) {
    let newIndex, items, times;
    switch (itemType) {
        case 1:
            items = lis;
            times = staticTimes;
            break;
        case 2:
            items = pics;
            times = picsTimes;
        default:
            break;
    }
    newIndex = currentIndex + 1;
    item = items[newIndex];

    if (!item) {
        newIndex = 0;
        item = items[0];
    }

    showItem(itemType, item, newIndex, times);
}
/* */

//nav-static msgs
const lis = document.querySelectorAll(".nav-static-messages li");
const staticTimes = {
    fadeinT: 0,
    delayShow: 2500,
    fadeoutT: 500,
    delayToNext: 500,
};
showItem(1, lis[0], 0, staticTimes);

// /* */ // // /* */ // // /* */ // // /* */ // // /* */ // // /* */ // // /* */ //
/**
 *
 * @param {HTMLElementNode} node
 * @param {int} slideWork 1:slideDown - 2:slideUp - 3: slideToggle
 */
function slideMenu(node, slideWork) {
    const children = node.children;
    const lastChild = children[children.length - 1];
    if (lastChild.nodeName === "UL") {
        switch (slideWork) {
            case 1:
                $(lastChild).slideDown(200);
                break;
            case 2:
                $(lastChild).slideUp(200);
                break;
            default:
                $(lastChild).slideToggle(200);
                break;
        }
    }
}

$(".nav-fix-links li").hover(
    function () {
        slideMenu(this, 1);
    },
    function () {
        slideMenu(this, 2);
    }
);
const navBtn = document.querySelector(".nav-btn");
const navPhoneUl = navBtn.parentElement;
// .children[1]
navBtn.onclick = () => slideMenu(navPhoneUl, 3);

// /* */ // // /* */ // // /* */ // // /* */ // // /* */ // // /* */ // // /* */ //

//nav-fix search
const searchBox = document.getElementById("search-form");
$(".nav-fix-search").click(() => $(searchBox).slideToggle(300));
$("#search-close").click(() => $(searchBox).slideUp(300));

// /* */ // // /* */ // // /* */ // // /* */ // // /* */ // // /* */ // // /* */ //

const shopBox = document.getElementsByClassName("shopcart-box")[0];
const shopItems = document.getElementsByClassName("shopcart-items-box")[0];
/* SHOPCART REQUEST */
const cartItems = document.getElementsByClassName('shopcart-items')[0];
const loadingCart = document.getElementById("load-cart");
const cartFullprice = document.getElementsByClassName('shopcart-fullprice')[0];
function loadShopcart() {
    loadingCart.style.display = 'flex';
    // while (cartItems.lastChild) {
    //     cartItems.removeChild(cartItems.lastChild);
    // }

    const req = new XMLHttpRequest()

    req.onreadystatechange = () => {
        if (req.status === 200 && req.readyState === 4) {
            loadingCart.style.display = 'none';
            const items = JSON.parse(req.response);
            let fullprice = 0
            for (const shopitem of items) {
                const item = document.createElement('div');
                item.classList.add("shopcart-item");
                // item.setAttribute("id", shopitem.id);
                // item.setAttribute("price", shopitem.price);
                // item.setAttribute("count", shopitem.count);

                const itemPic = document.createElement('img');
                itemPic.classList.add("shopcart-item-pic");
                itemPic.setAttribute("src", shopitem.pic);

                const itemRem = document.createElement("span");
                itemRem.classList.add('icon-cross');
                itemRem.classList.add('shopcart-item-remove');
                itemRem.onclick = () => {
                    const req = new XMLHttpRequest();
                    req.onreadystatechange = () => {
                        if (req.status === 200 && req.readyState === 4) {
                            if (req.responseText === "0") {
                                $(item).fadeOut(700, () => { item.remove(); });
                            }
                        }

                    }
                    req.open("POST", '/api/cart');
                    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    req.send('job=rem&itemid=' + shopitem.id);
                }

                const itemName = document.createElement('h4');
                itemName.classList.add("shopcart-item-name");
                itemName.innerText = shopitem.name;

                const itemInfo = document.createElement('div');
                itemInfo.classList.add("shopcart-item-info");

                const itemPrice = document.createElement('span');
                itemPrice.classList.add("shopcart-item-price");
                itemPrice.innerText = shopitem.price;

                const itemCount = document.createElement('span');
                itemCount.classList.add("shopcart-item-count");
                itemCount.innerText = shopitem.count;

                itemInfo.appendChild(itemPrice);
                itemInfo.appendChild(itemCount);

                item.appendChild(itemPic);
                item.appendChild(itemName);
                item.appendChild(itemInfo);
                item.appendChild(itemRem);

                cartItems.appendChild(item);


                fullprice += shopitem.price * shopitem.count;
                //   .shopcart-item(price='20000' count='0')
                //   img.shopcart-item-pic(src='/content/pok.png')
                //   h4.shopcart-item-name استیکر پوکرفیس
                //   .shopcart-item-info
                //   span.shopcart-item-price 25000
                //   span.shopcart-item-count 3
            }
            cartFullprice.innerText = fullprice;
        }
    }

    req.open('POST', "/api/cart");
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send("job=get");
}
/* FADE IN-OUT */
$(".nav-fix-shopcart").click(() => {
    $(cartItems).empty();
    $(shopBox).fadeIn(500);
    const boxWidth = window.getComputedStyle(document.documentElement).getPropertyValue("--shopcart-width").trim();
    $(shopItems).delay(150).animate({ width: boxWidth }, 1000);
    loadShopcart();
});
$(".shopcart-close").click(() => {
    $(shopItems).animate({ width: "0px" }, 800);
    $(shopBox).delay(300).fadeOut(500);
});

// /* */ // // /* */ // // /* */ // // /* */ // // /* */ // // /* */ // // /* */ //

