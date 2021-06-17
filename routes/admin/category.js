const express = require('express');
const router = express.Router();





router.get('/', async (req, res) => {
    let msg, category;
    if (req.query.edit) {
        const catName = req.query.edit.trim();
        category = await Category.findOne({ where: { name: catName } });
        if (!category) {
            msg = `دسته بندی با نام ${catName} وجود ندارد`;
        } else {
            msg = `درحال ویرایش دسته بندی  ${catName} هستید`;
        }
    } else if (req.query.delete) {
        const catName = req.query.delete;
        category = await Category.findOne({ where: { name: catName } });
        if (!category) {
            msg = `دسته بندی با نام ${catName} وجود ندارد`;
        } else {
            await Item.update({ category: 'none' }, { where: { category: catName } });
            await category.destroy();
            msg = `دسته بندی ${catName} حذف شد`;
            category = null;
        }
    } else {
    }
    const categories = await Category.findAll()
    res.render("admin/category", { categories: categories, category: category, msg: msg });
})


router.post('/', async (req, res) => {
    let catName = req.body.name;
    let msg;
    if (catName) {
        catName = catName.trim();
        if (await Category.findOne({ where: { name: catName } })) {
            msg = `دسته بندی با نام ${catName} وجود دارد`;
        } else {
            let oldName = req.body.oldName;
            if (!oldName) {
                await Category.create({ name: catName });
                msg = `دسته بندی با نام ${catName} ساخته شد`;
            } else {
                oldName = oldName.trim();
                const category = await Category.findOne({ where: { name: oldName } });
                if (category) {
                    await Item.update({ category: catName }, { where: { category: oldName } });
                    await Category.update({ name: catName }, { where: { name: oldName } });
                    msg = `دسته بندی ${oldName} به ${catName} تغییر یافت`;
                }
            }
        }
    }
    const categories = await Category.findAll()
    res.render("admin/category", { categories: categories, msg: msg });
})









module.exports = router;