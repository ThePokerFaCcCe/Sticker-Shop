const express = require("express");
const router = express.Router();

const { Op } = require("sequelize");

const bodyParser = require('body-parser');
const multer = require("multer");
const upload = multer();

const bcrypt = require('bcrypt');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(upload.array());
/*
router.post("/signup", async (req, res) => {
    try {
        const name = req.body.name;
        const password = await bcrypt.hash(req.body.pass, 10);
        const email = req.body.email;

        const newUser = await User.create({ name: name, password: password, email: email });
        res.json({ code: 200 });
    } catch{
        res.json({ code: 400, reason: "خطایی رخ داده. مجددا تلاش کنید" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.pass;

        const user = await User.findOne({
            attributes: ['id', 'password'],
            where: {
                email: email
            }
        });

        if (user) {
            const samePassword = await bcrypt.compare(password, user.password);
            if (samePassword) {
                res.json({ code: 200 });
            } else {
                res.json({ code: 400, reason: "رمز عبور اشتباه است" });
            }
        } else {
            res.json({ code: 400, reason: "این ایمیل قبلا ثبت نشده" });
        }
    } catch{
        res.json({ code: 400, reason: "خطایی رخ داده. مجددا تلاش کنید" });
    }
})
*/
router.post("/like", async (req, res) => {
    if (req.user && req.body.itemid) {
        const itemID = req.body.itemid;
        const userID = req.user.id;
        const item = await Item.findOne({ where: { id: itemID } });
        if (item) {
            const liked = await Like.findOne({ where: { user_id: userID, item_id: itemID } });
            if (liked) {
                await liked.destroy();
                await item.decrement('likes');
            } else {
                await Like.create({ item_id: itemID, user_id: userID })
                await item.increment('likes');
            }
            await item.reload();

            res.send(`${item.likes}`);
            return
        }
    }
    res.send("-1");
})

router.post('/cart', async (req, res) => {
    if (req.user) {
        const userID = req.user.id;
        const itemID = req.body.itemid;
        const job = req.body.job;
        if (job) {
            if (itemID) {
                const item = await Item.findOne({ where: { id: itemID } });
                if (item) {
                    let itemInCart = req.shopcart.filter((cart) => (cart.item_id == itemID))[0];
                    // itemInCart = (itemInCart) ? itemInCart[0] : false;

                    if (job === 'add') {
                        const count = parseInt(req.body.count);
                        if (!isNaN(count) && count > 0 && count <= item.total) {
                            if (itemInCart) {
                                itemInCart.count = count;
                                await itemInCart.save()
                            } else {
                                await Cart.create({ item_id: itemID, user_id: userID, count: count });
                            }
                            res.send(`${count}`);
                            return

                        } else {
                            if (itemInCart) {
                                await itemInCart.destroy();
                                res.send('افزودن به سبد');
                                return
                            } else {
                                await Cart.create({ item_id: itemID, user_id: userID });
                                res.send('حذف از سبد');
                                return
                            }
                        }
                    } else if (job === 'rem') {
                        if (itemInCart) {
                            await itemInCart.destroy();
                            res.send('0');
                            return
                        }
                    }
                }
            }
            else if (job === 'get') {
                const items = [];
                for (const cart of req.shopcart) {
                    const item = await Item.findOne({ where: { id: cart.item_id } });
                    if (item) {
                        const cartItem = {}
                        cartItem.id = item.id;
                        cartItem.name = item.title;
                        cartItem.price = (item.off > 0) ? item.price - item.off / 100 * item.price : item.price;
                        cartItem.count = cart.count;
                        cartItem.pic = `${_config.path.STATICPATH}/${item.pic}`
                        items.push(cartItem);
                    } else {
                        await cart.destroy();
                    }
                }
                res.json(items);
                return
            }
        }
        // res.statusCode = 400;
        res.send('-1');
    }
    else {
        res.send("-2");
    }
});

module.exports = router;