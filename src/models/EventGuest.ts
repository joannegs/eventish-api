import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    guest: {
        type: Schema.Types.ObjectId, 
        ref: 'user'
    }, 
    
   event: {
        type: Schema.Types.ObjectId,
        ref: 'event'
   }
});

export const EventGuest = mongoose.model('EventGuest', schema);