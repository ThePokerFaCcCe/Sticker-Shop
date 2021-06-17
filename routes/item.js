const express = require('express');
const router = express.Router();

const { body, param, validationResult } = require('express-validator');

async function getComments(comments, itemId) {
    //item.comments = await Comment.findAll({ where: { item_id: item.id, hidden: false, /*accepted: true,*/ reply_to: 0 }, order: [['write_date', 'DESC']] });
    if (comments) {
        for (const comment of comments) {
            const user = await User.findOne({ where: { id: comment.user_id } });
            if (user) {
                comment.author = user.name;
                comment.isAdmin = (user.rank === 'admin');
                const subComments = await Comment.findAll({ where: { item_id: itemId, hidden: false, /*accepted: true,*/ reply_to: comment.id }, order: [['write_date', 'ASC']] });
                comment.subComments = await getComments(subComments, itemId);
            } else {
                comment.hidden = true;
                await comment.save();
            }
        }
    }
    return comments;
}
router.get('/:id', async (req, res) => {
    const itemID = parseInt(req.params.id);
    let msg;
    if (!isNaN(itemID) && itemID > 0 && isFinite(itemID)) {
        const item = await Item.findOne({ where: { id: itemID } });
        if (item) {
            item.infoes = item.info.split("\n");
            const off = item.off;
            if (off > 0 && off < 101) {
                const price = item.price;
                item.priceOff = price - (off / 100 * price);
            }
            item.exists = (item.total > 0) ? true : false;
            const comments = await Comment.findAll({ where: { item_id: item.id, hidden: false, /*accepted: true,*/ reply_to: 0 }, order: [['write_date', 'DESC']] });
            item.comments = await getComments(comments, item.id);
            res.render("item", { item: item, staticPath: process.env.STATICPATH, ...req.important });
            return;
        } else {
            msg = 'کالا یافت نشد';
        }
    } else {
        msg = 'کالا یافت نشد';
    }
    res.render("item", { msg: msg, staticPath: process.env.STATICPATH, ...req.important });

});

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.post(
    '/:id',
    body('comment', 'لطفا بین ۲ تا ۱۲۰ کلمه وارد کنید').trim().isLength({ min: 2, max: 120 }),
    // body('itemid', 'آیدی کالا غیرمجاز').isInt({ min: 1 }).toInt(),
    param('id', 'کالا یافت نشد').isInt({ min: 1 }).toInt(),
    body('replyto', 'نظر یافت نشد').isInt({ min: 0 }).toInt(),
    async (req, res) => {
        let msg, item;
        if (req.user) {
            const validerr = validationResult(req);
            if (validerr.isEmpty()) {
                const params = { user_id: req.user.id, item_id: req.params.id, reply_to: req.body.replyto, text: req.body.comment };
                params.accepted = (req.user.rank === 'admin') ? true : false;
                item = await Item.findOne({ where: { id: params.item_id } });
                if (item) {
                    if (params.reply_to > 0) {
                        const reply = await Comment.findOne({ where: { id: params.reply_to } });
                        if (reply) {
                            if (reply.reply_to === 0) {
                                await Comment.create(params);
                                msg = 'نظر شما با موفقیت ثبت شد.' + (params.accepted) ? "" : ' منتظر تایید از طرف مدیریت بمانید';
                            } else {
                                msg = 'امکان ارسال جواب تو در تو وجود ندارد';
                            }
                        } else {
                            msg = 'نظر برای جواب یافت نشد';
                        }
                    } else {
                        await Comment.create(params);
                        msg = 'نظر شما با موفقیت ثبت شد.' + (params.accepted) ? "" : ' منتظر تایید از طرف مدیریت بمانید';

                    }
                } else {
                    msg = 'کالا یافت نشد';
                }
            } else {
                msg = validerr.array({ onlyFirstError: true })[0].msg;
            }
        } else {
            msg = 'شما مهمان هستید';
        }
        if (item) {
            item.infoes = item.info.split("\n");
            const off = item.off;
            if (off > 0 && off < 101) {
                const price = item.price;
                item.priceOff = price - (off / 100 * price);
            }
            item.exists = (item.total > 0) ? true : false;
            const comments = await Comment.findAll({ where: { item_id: item.id, hidden: false, /*accepted: true,*/ reply_to: 0 }, order: [['write_date', 'DESC']] });
            item.comments = await getComments(comments, item.id);

        }

        res.render("item", { msg: msg, item: item, staticPath: process.env.STATICPATH, ...req.important });
    }
);





module.exports = router;