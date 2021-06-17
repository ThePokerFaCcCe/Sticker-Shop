const express = require("express");
const router = express.Router();
const fs = require("fs");
const fileCheck = require(`${_HOME}/controllers/checkFile.js`);
const homeParser = require(`${_HOME}/controllers/homepage.js`);

router.get("/", async (req, res) => {
    let msg;
    if (req.query.delete) {
        const item = await Homepage.findOne({
            where: { id: req.query.delete },
        });
        if (item) {
            await item.destroy();
            msg = "ایتم با موفقیت حذف شد";
        }
    }
    const params = await homeParser(req.categories)
    res.render("admin/homepage", {
        msg: msg,
        categories: req.categories,
        staticPath: process.env.STATICPATH,
        ...params,
    });
});


function convertNum(num) {
    return Number(num.replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (d) {
        return d.charCodeAt(0) - 1632; // Convert Arabic numbers
    }).replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function (d) {
        return d.charCodeAt(0) - 1776; // Convert Persian numbers
    }));
}

const pickedFile = upload.single("pic");

router.post("/", pickedFile, async (req, res) => {
    const chmsgs = req.body.chmsgs;
    const chheadpic = req.body.chheadpic;
    const chcats = req.body.chcats;
    const chitems = req.body.chitems;
    let msg;

    if (chmsgs) {
        if (chmsgs === "1") {
            let msgs = req.body.msgs;
            if (msgs && msgs.length > 3) {
                msgs = msgs.trim()
                const [worked, created] = await Homepage.findOrCreate({
                    where: { name: "msgs" },
                    defaults: { value: msgs },
                });
                if (worked) {
                    if (created) {
                        msg = "پیغام های بالای سایت افزوده شد";
                    } else {
                        worked.value = msgs;
                        await worked.save();
                        msg = "پیغام های بالای سایت تغییر  یافت";
                    }
                }
            } else {
                msg = "حداقل سه حرف برای پیغام ها وارد کنید";
            }
            await Homepage.update({ value: "1" }, { where: { name: "use-msgs" } });
        } else {
            await Homepage.update({ value: "0" }, { where: { name: "use-msgs" } });
            msg = "پیغام ها غیر فعال شد";
        }
    }
    if (chheadpic) {
        if (chheadpic === "1") {
            const pic = req.file;
            let picheader = req.body.picheader,
                pictext = req.body.pictext;

            if (pic && picheader && pictext) {
                picheader = picheader.trim();
                pictext = pictext.trim();
                if (picheader.length > 3 && pictext.length > 3) {
                    if (fileCheck(pic)) {
                        const imgName = `${parseInt(Math.random() * 1e5)}${Date.now()}${pic.originalname}`;
                        const imgPath = `${process.env.IMGPATH}/${imgName}`;
                        fs.renameSync(pic.path, imgPath);

                        const params = { name: "headpic", use: true };
                        params.value = [
                            imgName,
                            picheader.replace("|&|", ""),
                            pictext.replace("|&|", ""),
                        ].join("|&|");

                        const worked = await Homepage.create(params);
                        if (worked) {
                            msg = "تصویر جدید به بالای سایت افزوده شد";
                        }
                    } else {
                        msg = "لطفا عکس معتبر وارد کنید";
                        fs.unlinkSync(pic.path);
                    }
                } else {
                    msg = 'حداقل ۳ کلمه برای هدر یا متن عکس وارد کنید';
                }
            } else {
                msg = "لطفا تمام فیلد ها را پر کنید";
            }
            await Homepage.update({ value: "1" }, { where: { name: "use-headpic" } });
        } else {
            await Homepage.update({ value: "0" }, { where: { name: "use-headpic" } });
            msg = "تصویر بالای سایت غیرفعال شد";
        }
    }
    if (chcats) {
        if (chcats === "1") {
            const pic = req.file,
                catname = req.body.catname;
            if (pic && catname && catname.length > 2) {
                if (fileCheck(pic)) {
                    const imgName = `${parseInt(
                        Math.random() * 1e5
                    )}${Date.now()}${pic.originalname}`;
                    const imgPath = `${process.env.IMGPATH}/${imgName}`;
                    fs.renameSync(pic.path, imgPath);

                    const params = { name: "category", use: true };
                    params.value = [imgName, catname.replace("|&|", "")].join(
                        "|&|"
                    );

                    const worked = await Homepage.create(params);
                    if (worked) {
                        msg = "تصویر جدید برای دسته بندی افزوده شد";
                    }
                } else {
                    msg = "لطفا عکس معتبر وارد کنید";
                    fs.unlinkSync(pic.path);
                }
            } else {
                msg = "لطفا تمام فیلد ها را پر کنید";
            }
            await Homepage.update({ value: "1" }, { where: { name: "use-category" } });
        } else {
            await Homepage.update({ value: "0" }, { where: { name: "use-category" } });
            msg = "نمایش دسته بندی غیرفعال شد";
        }
    }
    if (chitems) {
        if (chitems === "1") {
            const items = req.body.items;
            if (items && items.length > 3) {
                const listItems = [];
                items.split("\n").map((itm) => {
                    const item = itm.split("-");
                    console.log(item);

                    if (item.length === 2) {
                        const catName = item[0].trim();
                        const itemCount = convertNum(item[1].trim());
                        if (
                            catName &&
                            !isNaN(itemCount) &&
                            itemCount > 0 &&
                            catName.length > 2
                        ) {
                            listItems.push([catName, itemCount].join("-"));
                        }
                    }
                });
                if (listItems.length > 0) {
                    const [worked, created] = await Homepage.findOrCreate({
                        where: { name: "items" },
                        defaults: { value: listItems.join("\n") },
                    });
                    if (worked) {
                        if (created) {
                            msg = "نمایش محصولات ساخته شد";
                        } else {
                            worked.value = listItems.join("\n");
                            await worked.save();
                            msg = "نمایش محصولات تغییر یافت";
                        }
                    }
                } else {
                    msg = "هیچ عبارت معتبری وارد نکردید";
                }
            } else {
                msg = "لطفا تمام فیلد ها را پر کنید";
            }
            await Homepage.update({ value: "1" }, { where: { name: "use-items" } });
        } else {
            await Homepage.update({ value: "0" }, { where: { name: "use-items" } });
            msg = "نمایش محصولات غیرفعال شد";
        }
    }
    if (!msg) {
        msg = "خطایی رخ داد...";
    }
    const params = await homeParser(req.categories)
    res.render("admin/homepage", { categories: req.categories, msg: msg, staticPath: process.env.STATICPATH, ...params });
});

module.exports = router;
