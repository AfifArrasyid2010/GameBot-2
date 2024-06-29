const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    chatId: String,
    nickname: String,
    level: { type: Number, default: 1 },
    exp: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    boosts: [
        {
            name: String,
            remaining: { type: Number, default: 0 },
        }
    ]
});

module.exports = mongoose.model('User', userSchema);
