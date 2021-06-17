const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');

/**
 * 
 * @param {object} options accepted, hidden, sub_is_hidden
 * @returns any:[]
 */
async function getComments(options) {
    let comments;
    comments = await Comment.findAll({ where: options, order: [['edit_date', 'DESC']] });
    for (const comment of comments) {
        const user = await User.findOne({ where: { id: comment.user_id } });
        if (user) {
            comment.author = user.name;
        } else {
            comment.author = "حساب حذف شده";
            // comments.splice(comments.indexOf(comment), 1);
            // await comment.destroy();
        }
    };
    return comments;
}


async function editSubComments(commentId, makeHidden, count = 0) {
    const comments = await Comment.findAll({ where: { reply_to: commentId, sub_is_hidden: (!makeHidden), hidden: false }, order: [['write_date', 'ASC']] });
    if (comments) {
        for (const comment of comments) {
            comment.sub_is_hidden = makeHidden;
            await comment.save();
            count++;
            count = await editSubComments(comment.id, makeHidden, count);
        }
    }
    return count;
}



router.get('/unaccepted', async (req, res) => {
    const comments = await getComments({ accepted: false, hidden: false, sub_is_hidden: false });
    res.render("admin/comment", { type: "uacc", comments: comments });
});

router.get('/deleted', async (req, res) => {
    const comments = await getComments({ hidden: true });
    res.render("admin/comment", { type: "del", comments: comments });
});

router.get('/accepted', async (req, res) => {
    const comments = await getComments({ accepted: true, hidden: false, sub_is_hidden: false });
    res.render("admin/comment", { type: "acc", comments: comments });
});


router.post('/delete',
    body("id", "آیدی نامعتبر وارد شده است").isInt({ min: 1 }).toInt(),
    async (req, res) => {
        const validerr = validationResult(req);
        if (validerr.isEmpty()) {
            const comment = await Comment.findOne({ where: { id: req.body.id } });
            if (comment) {
                comment.hidden = true;
                await comment.save();
            }
            const countSubs = await editSubComments(comment.id, true);
            res.statusCode = 200;
            res.json({ msg: `کامنت ${(countSubs > 0 ? `و ${countSubs} عدد پاسخ` : '')} حذف شد` });
        }
        else {
            res.statusCode = 400;
            res.json({ error: validerr.array({ onlyFirstError: true })[0].msg });
        }
    }
);

router.post('/edit',
    body("id", "آیدی نامعتبر وارد شده است").isInt({ min: 1 }).toInt(),
    body('text', 'لطفا بین ۲ تا ۱۲۰ کلمه وارد کنید').trim().isLength({ min: 2, max: 120 }),
    async (req, res) => {
        const validerr = validationResult(req);
        if (validerr.isEmpty()) {
            const comment = await Comment.findOne({ where: { id: req.body.id } });
            if (comment) {
                if (!comment.accepted || comment.hidden) {
                    comment.text = req.body.text;
                    comment.accepted = true;
                    comment.hidden = false;
                    await comment.save();

                    await editSubComments(comment.id, false);
                    res.statusCode = 200;
                    res.json({ msg: `کامنت ویرایش و تایید شد` });
                } else {
                    res.statusCode = 400;
                    res.json({ error: "کامنت قبلا تایید شده" });
                }
            } else {
                res.statusCode = 404;
                res.json({ error: "کامنت یافت نشد" });
            }
        }
        else {
            res.statusCode = 400;
            res.json({ error: validerr.array({ onlyFirstError: true })[0].msg });
        }
    }
);

router.post('/accept',
    body("id", "آیدی نامعتبر وارد شده است").isInt({ min: 1 }).toInt(),
    async (req, res) => {
        const validerr = validationResult(req);
        if (validerr.isEmpty()) {
            const comment = await Comment.findOne({ where: { id: req.body.id } });
            if (comment) {
                if (!comment.accepted || comment.hidden) {
                    comment.hidden = false;
                    comment.accepted = true;
                    await comment.save();
                    await editSubComments(comment.id, false);

                    res.statusCode = 200;
                    res.json({ msg: `کامنت تایید شد` });
                } else {
                    res.statusCode = 400;
                    res.json({ error: "کامنت قبلا تایید شده" });
                }
            } else {
                res.statusCode = 404;
                res.json({ error: "کامنت یافت نشد" });
            }
        }
        else {
            res.statusCode = 400;
            res.json({ error: validerr.array({ onlyFirstError: true })[0].msg });
        }
    }
);


router.get('/:cid',
    param("cid", "آیدی نامعتبر وارد شده است").isInt({ min: 1 }).toInt(),
    async (req, res) => {
        const validerr = validationResult(req);
        let comment, msg;
        if (validerr.isEmpty()) {
            comment = await Comment.findOne({ where: { id: req.params.cid } });
            if (comment) {
                const user = await User.findOne({ where: { id: comment.user_id } });
                if (user) {
                    comment.author = user.name;
                } else {
                    comment.author = "حساب حذف شده";
                }
            }
            else {
                res.statusCode = 404;
                msg = "کامنت یافت نشد";
            }
        }
        else {
            res.statusCode = 400;
            msg = validerr.array({ onlyFirstError: true })[0].msg;
        }
        res.render("admin/comment", { msg: msg, type: 'one', comment: comment || false });
    }
);

module.exports = router;