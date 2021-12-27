import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'user'
    }, 

    title: {        
        type: String, 
        required: true
    },

    description: {
        type: String, 
        required: false
    },

    startsAt: {
        type: Date, 
        required: true
    },

    endsAt: {
        type: Date, 
        required: true
    }
});

export const Event = mongoose.model('Event', schema);