const express = require('express');
const router = express.Router();




router.get('/', async (req, res) => {
    let err;
    if (req.user) {
        if (req.shopcart.length > 0) {
            const cart = [];
            let fullPrice = 0;
            for (const cartitem of req.shopcart) {
                const item = await Item.findOne({ where: { id: cartitem.item_id } });
                if (item) {
                    item.price = (item.off > 0) ? item.price - (item.off / 100 * item.price) : item.price;
                    item.count = cartitem.count;
                    cart.push(item);
                    fullPrice += item.price;
                } else {
                    cartitem.destroy();
                }
            }
            res.render("shopcart", { staticPath: process.env.STATICPATH, cart: cart, fullPrice: fullPrice, ...req.important });
        } else {
            err = process.env.ERR_EMPTYCART;
        }
    } else {
        err = process.env.ERR_GUEST;
    }
    if (err) {
        res.render('erroruser', { errors: [err], ...req.important });
    }
});








module.exports = router;