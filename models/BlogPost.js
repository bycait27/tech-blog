const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class BlogPost extends Model {}

BlogPost.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date_created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        // foreign key to User's id 
        user_id: {
            type: DataTypes.INTEGER,
            // reference user id
            references: {
                model: 'user',
                key: 'id',
            },
        },
        // if this doesn't work, put it in comment model
        // comment_id: {
        //     type: DataTypes.INTEGER,
        //     // reference comment id
        //     references: {
        //         model: 'comment',
        //         key: 'id',
        //     },
        // },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'blogPost',
    }
);

module.exports = BlogPost;