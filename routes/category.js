const express = require('express');
const router = express.Router();





router.get("/:catName", async (req, res) => {
    let catName = req.params.catName;
    let items;

    if (catName !== 'همه') {
        const category = await Category.findOne({ where: { name: catName } });
        if (category) {
            items = await Item.findAll({ where: { category: category.name } });
        } else {
            items = [];
            catName = null;
        }
    } else {
        items = await Item.findAll();
    }
    if (req.user) {
        const likes = await Like.findAll({ where: { user_id: req.user.id } })
        items.map((item) => {
            const inCart = req.shopcart.filter((cart) => cart.item_id === item.id)[0];
            const liked = likes.filter((like) => like.item_id === item.id)[0];
            if (inCart) {
                item.inCart = true;
            }
            if (liked) {
                item.liked = true;
            }
        });
    }
    res.render("category", { catName: catName, items: items, staticPath: process.env.STATICPATH, itemLink: "/item", ...req.important });
});







module.exports = router;