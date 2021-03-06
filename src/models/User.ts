import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String, 
        required: true,
        trim: true
    }, 

    email: {
        type: String, 
        required: true,
        unique: true
    },
    
    password: {
        type: String, 
        required: true
    }
});

export const User = mongoose.model('User', schema);