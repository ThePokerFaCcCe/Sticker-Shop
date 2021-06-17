
async function homeParser(categories, admin = true, onlyMsg = false) {


    if (onlyMsg) {
        const pmsgs = {}
        const usemsgs = await Homepage.findOne({ where: { name: "use-msgs" } })
        pmsgs.use = (usemsgs.value === '1');

        if (pmsgs.use || admin) {
            const msgs = await Homepage.findOne({ where: { name: "msgs" } });
            if (msgs) {
                pmsgs.value = (admin) ? msgs.value : msgs.value.split('\n');
            } else {
                pmsgs.use = false
                await Homepage.update({ value: "0" }, { where: { name: "use-msgs" } });
            }
        }
        return pmsgs;
    } else {
        const params = { headpic: { value: [] }, items: { value: [] }, msgs: { value: [] }, cats: { value: [] } };// headpic, items, msgs, cats;

        const usemsgs = await Homepage.findOne({ where: { name: "use-msgs" } })
        params.msgs.use = (usemsgs.value === '1');

        if (params.msgs.use || admin) {
            const msgs = await Homepage.findOne({ where: { name: "msgs" } });
            if (msgs) {
                params.msgs.value = (admin) ? msgs.value : msgs.value.split('\n');
            } else {
                params.msgs.use = false
                await Homepage.update({ value: "0" }, { where: { name: "use-msgs" } });
            }
        }



        const useheadpic = await Homepage.findOne({ where: { name: "use-headpic" } })
        params.headpic.use = (useheadpic.value === '1');

        if (params.headpic.use || admin) {
            const headpics = await Homepage.findAll({ where: { name: "headpic" } });
            if (headpics) {
                const hpList = [];
                for (const headpic of headpics) {
                    const hp = {};
                    const info = headpic.value.split("|&|");
                    hp.pic = info[0];
                    hp.head = info[1];
                    hp.text = info[2];
                    hp.id = headpic.id
                    hpList.push(hp);
                }
                params.headpic.value = hpList;
            } else {
                params.headpic.use = false;
                await Homepage.update({ value: "0" }, { where: { name: "use-headpic" } });
            }
        }



        console.log('onlymsg: ' + onlyMsg);
        const useitems = await Homepage.findOne({ where: { name: "use-items" } })
        params.items.use = (useitems.value === '1');
        if (params.items.use || admin) {
            const itemsOld = await Homepage.findOne({ where: { name: "items" } });
            if (itemsOld && itemsOld.value.length > 2) {
                const itemList = [];
                const itemsNew = []
                const items = itemsOld.value.split('\n');
                for (const itm of items) {
                    const item = {};

                    const info = itm.split('-');

                    item.catName = info[0];
                    item.count = parseInt(info[1]);
                    let found;
                    switch (item.catName) {
                        case 'جدید ترین':
                            item.catName += " محصولات"
                            item.items = await Item.findAll({ order: [['add_date', 'DESC']], limit: item.count });
                            break;
                        case 'محبوب ترین':
                            item.catName += " محصولات"
                            item.items = await Item.findAll({ order: [['likes', 'DESC']], limit: item.count });
                            break;
                        default:
                            const exists = categories.filter((cat) => cat.name === item.catName);
                            if (exists.length > 0) {
                                item.items = await Item.findAll({ where: { category: item.catName }, limit: item.count });
                                if (item.items) {
                                    item.catName = `دسته بندی ${item.catName}`;
                                }
                            }
                            break;
                    }

                    if (item.items) { //item.items.length > 0 ||
                        itemsNew.push(itm);
                        itemList.push(item);
                    }
                }
                if (items.length !== itemsNew.length) {
                    Homepage.update({ value: itemsNew.join("\n") }, { where: { name: "items" } });
                }
                params.items.value = (admin) ? itemsNew.join('\n') : itemList;
            } else {
                params.items.use = false;
                await Homepage.update({ value: "0" }, { where: { name: "use-items" } });
            }
        }



        const usecategory = await Homepage.findOne({ where: { name: "use-category" } })
        params.cats.use = (usecategory.value === '1');

        if (params.cats.use || admin) {
            const cats = await Homepage.findAll({ where: { name: "category" } });
            if (cats) {
                const catsList = [];
                for (const cat of cats) {
                    const info = cat.value.split("|&|");
                    const catname = info[1];
                    const exists = categories.filter((cat) => cat.name === catname);
                    if (exists.length > 0) {
                        catsList.push({ id: cat.id, name: catname, pic: info[0] });
                    } else {
                        cat.destroy();
                    }
                }
                params.cats.value = catsList;
            } else {
                params.cats.use = false;
                await Homepage.update({ value: "0" }, { where: { name: "use-category" } });
            }
        }

        params.staticPath = process.env.STATICPATH;
        return params;
    }
}
module.exports = homeParser;