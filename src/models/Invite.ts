import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'user'
    }, 
    
   event: {
        type: Schema.Types.ObjectId,
        ref: 'event'
   },

   message: {
       type: String, 
       required: false
   }
});

export const Invite = mongoose.model('Invite', schema);