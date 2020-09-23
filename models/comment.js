const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        body: {
            type: String,
            required: true,
            unique: true
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            autopopulate: true
        },
        children: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment',
                autopopulate: true
            }
        ],
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: false
    }
);

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Comment', schema);