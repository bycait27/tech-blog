const User = require ('./User');
const BlogPost = require('./BlogPost');
const Comment = require('./Comment');

User.hasMany(BlogPost, {
    foreignKey: 'user_id',
});

BlogPost.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL'
});

BlogPost.hasMany(Comment, {
    foreignKey: 'blogpost_id',
});

User.hasMany(Comment, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL'
});

Comment.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL'
});

Comment.belongsTo(BlogPost, {
    foreignKey: 'blogpost_id',
    onDelete: 'SET NULL'
});

module.exports = { User, BlogPost, Comment };

