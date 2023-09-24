const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {}

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // author: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        // },
        date_created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        // foreign key to User id
        user_id: {
            type: DataTypes.INTEGER,
            // reference User id
            references: {
                model: 'user',
                key: 'id'
            }
        },
        // foreign key to BlogPost id
        blogpost_id: {
            type: DataTypes.INTEGER,
            // reference BlogPost id
            references: {
                model: 'blogPost',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'comment',
    }
);

module.exports = Comment;