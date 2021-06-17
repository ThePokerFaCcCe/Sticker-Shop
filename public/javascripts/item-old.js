const addbtn = document.querySelector('.item-add-cart');
const addbtnTxt = addbtn.innerHTML;
const shopCartNum = document.getElementById("shop-cart-num");
const itemShopCartNum = document.getElementById("item-shop-cart-total");
let addbtnTxtChanged = false;
// function animateItem(slct) {
//     let opacity = parseFloat(document.documentElement.style.getPropertyValue(slct));
//     opacity = (isNaN(opacity)) ? 0 : opacity;
//     console.log(opacity)

//     if (opacity >= 1) {
//         filled = true;
//         clearInterval(anim);
//         setTimeout(() => { anim = setInterval(() => animateItem(slct), 300); }, 2000);
//     }
//     if (!filled) {
//         document.documentElement.style.setProperty(slct, (opacity + 0.1).toFixed(1).toString());
//     } else {
//         const newOpct = (opacity - 0.1).toFixed(1);
//         if (newOpct <= 0) {
//             document.documentElement.style.setProperty(slct, "0");
//             clearInterval(anim);
//         } else {
//             document.documentElement.style.setProperty(slct, newOpct.toString());
//         }
//     }
//     //clearInterval(anim);

// }
function showSts(item) {
    document.documentElement.style.setProperty(item, '1');
    setTimeout(() => {
        document.documentElement.style.setProperty(item, '0');
    }, 3000);
}
addbtn.onclick = () => {
    if (token) {
        // send req to sv
        const req = new XMLHttpRequest();
        req.onreadystatechange = () => {
            if ((req.readyState === 4) && (req.status === 200)) {
                let response = req.responseText.split(",");
                console.log(req.responseText);

                const newItemNumber = (response[0] == 0) ? false : response[0];
                const newShopCartNumber = (response[1] == -2) ? false : response[1];
                if (newItemNumber) {
                    itemShopCartNum.innerHTML = newItemNumber;
                    if (newShopCartNumber) {
                        shopCartNum.innerHTML = newShopCartNumber;
                    }
                }
                // anim = setInterval(() => animateItem("--sucOp"), 300);
                showSts("--sucOp");
                // filled = false;
            } else {
                // anim = setInterval(() => animateItem("--errOp"), 300);
                showSts("--errOp");
                // filled = false;
            }
        }
        req.open("POST", "shopcartworker.php");
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send("job=add&token=" + token + "&item_id=" + itemCode);


    } else {
        if (!addbtnTxtChanged) {
            addbtn.style.fontWeight = "bold";
            addbtn.innerHTML = "شما مهمان هستید!";
            addbtnTxtChanged = true;
            setTimeout(() => {
                addbtnTxtChanged = false;
                addbtn.innerHTML = addbtnTxt;
                addbtn.style.fontWeight = "normal";
            }, 3000);
        }
    }
}