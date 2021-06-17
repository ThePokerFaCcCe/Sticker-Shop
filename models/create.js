const { Sequelize, DataTypes, Model } = require("sequelize");
sequelize = new Sequelize(process.env.DB_URL, {
    dialect: "mysql",
    logging: false,
});

User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rank: {
            type: DataTypes.STRING(10),
            defaultValue: "user",
        },
        last_token: {
            type: DataTypes.STRING,
            defaultValue: "0",
        },
    },
    {
        //tableName:"users", // its not necessary bcs sequelize knows this
        timestamps: true,
        createdAt: "register_date",
        updatedAt: "lastedit_date",
    }
);
Category = sequelize.define(
    "Category",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);
Item = sequelize.define(
    "Item",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        info: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pic: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        total: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        off: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        likes: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0,
        },
        category: {
            type: DataTypes.STRING,
            defaultValue: "none",
        },
        sold: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0,
        },
    },
    {
        timestamps: true,
        createdAt: "add_date",
        updatedAt: "edit_date",
    }
);

Like = sequelize.define(
    "Like",
    {
        item_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        updatedAt: false,
        createdAt: "like_date",
    }
);

Cart = sequelize.define(
    "Cart",
    {
        item_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        count: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 1,
        },
    },
    {
        timestamps: true,
        updatedAt: false,
        createdAt: "add_date",
    }
);

Homepage = sequelize.define(
    "Homepage",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
        }, //,
        // use: {
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: true
        // }
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);
Address = sequelize.define(
    'Address',
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true, autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        postal: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: false
    }
);
Comment = sequelize.define(
    'Comment',
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true, autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        item_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        reply_to: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        accepted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        hidden: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        sub_is_hidden: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        timestamps: true,
        createdAt: "write_date",
        updatedAt: "edit_date"
    }
);
sequelize.sync({ alter: true /*, force:true*/ }); // `alter` will update columns and adds new columns if not exists but `force` will drop table and re-creates it
const x = async () => {
    try {
        await Homepage.findOrCreate({
            where: { name: "use-msgs" },
            defaults: { id: -1, value: "0" },
        });
        await Homepage.findOrCreate({
            where: { name: "use-headpic" },
            defaults: { id: -2, value: "0" },
        });
        await Homepage.findOrCreate({
            where: { name: "use-category" },
            defaults: { id: -3, value: "0" },
        });
        await Homepage.findOrCreate({
            where: { name: "use-items" },
            defaults: { id: -4, value: "0" },
        });
    } catch {
        setTimeout(x, 2000);
    }
};
setTimeout(x, 2000);
/*
class use_suggests extends Model { } // dont forget to comment it
use_suggests.init( // create model here and then write it to sequelize.define()

)
use_suggests.findOne
    */
