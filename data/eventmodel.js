const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    eventUsername: String,
    eventName: String,
    description: String,
    eventDate: String,
    eventTime: String,
    eventLocation: String,
    cost: Number,
    eventImage: Buffer,
    imageFileName: String,
    interestCount: Number,
    interestedUsers: [String],
    comments: [
        {
            comment_id: mongoose.Schema.Types.ObjectId,
            username: String,
            commentText: String,
        }
    ]
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
