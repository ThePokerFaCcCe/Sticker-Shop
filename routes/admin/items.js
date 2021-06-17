const express = require('express');
const router = express.Router();

const fs = require('fs');
const crypto = require('crypto');


router.get('/', async (req, res) => {
    const categories = await Category.findAll();
    let msg;
    if (req.query.edit) {
        const itemID = req.query.edit;
        const item = await Item.findOne({ where: { id: itemID } });
        if (item) {
            item.imgPath = `${process.env.STATICPATH}/${item.pic}`;
            res.render("admin/items", { item: item, categories: categories });
            return
        }
        msg = "محصول یافت نشد";

    } else if (req.query.delete) {
        const itemID = req.query.delete;
        const item = await Item.findOne({ where: { id: itemID } });
        if (item) {
            msg = `محصول ${item.title} حذف شد`
            await item.destroy();
        } else {
            msg = 'محصول یافت نشد';
        }
    }
    res.render("admin/items", { msg: msg, categories: categories });
})


const pickedFile = upload.single('pic');

router.post('/', pickedFile, async (req, res) => {
    const params = {};
    params.title = req.body.title || '!';
    params.category = req.body.category || '!';
    params.price = req.body.price || '!';
    params.off = req.body.off || '0';
    params.total = req.body.total || '!';
    params.pic = req.file || req.body.oldpicpath || "!";
    params.info = req.body.info || '!';

    const itemID = req.body.id || -1

    const categories = await Category.findAll();

    for (const [k, v] of Object.entries(params)) {
        if (v === "!") {
            params.imgPath = "/";

            params.id = itemID;

            res.render('admin/items', { msg: "لطفا تمام فیلد ها را پر کنید", categories: categories, item: params })
            return
        } else if (k !== 'pic') {
            params[k] = v.trim();
        }
    }

    let item;
    if (itemID !== -1) {
        item = await Item.findOne({ where: { id: itemID } });

        for (const [k, v] of Object.entries(params)) {
            if (k !== 'pic') {
                item[k] = v || item[k]

            } else {
                if (!req.file) {
                    item[k] = req.body.oldpicpath;
                }
            }
        }
        if (!req.file) {
            await item.save();
            item.imgPath = `${process.env.STATICPATH}/${item.pic}`;
            res.render("admin/items", { msg: `محصول ${item.title} ویرایش شد`, item: item, categories: categories });
            return
        }
    }

    // const imgName = `${crypto.randomBytes(10).toString('hex')}${req.file.originalname}`;
    const imgName = `${crypto.randomBytes(5).toString('hex')}${Date.now()}${req.file.originalname}`;
    const imgPath = `${process.env.IMGPATH}/${imgName}`;
    fs.readFile(req.file.path, (err, data) => {
        fs.writeFile(imgPath, data,
            async (err) => {
                (err) ? console.log(err) : '';
                if (!item) {
                    params.pic = imgName;
                    const item = await Item.create(params);
                    item.imgPath = `${process.env.STATICPATH}/${imgName}`;
                    res.render("admin/items", { msg: `محصول ${item.title} افزوده شد`, item: item, categories: categories });
                } else { // FOR EDITING..
                    item.pic = imgName;
                    await item.save();
                    item.imgPath = `${process.env.STATICPATH}/${imgName}`;
                    await fs.unlinkSync(req.file.path);
                    res.render("admin/items", { msg: `محصول ${item.title} ویرایش شد`, item: item, categories: categories });
                }
            });
    });

})

module.exports = router;