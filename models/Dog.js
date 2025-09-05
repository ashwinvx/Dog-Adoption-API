const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        default: 0, // Default age if not specified
    },
    description: String,
    adoptionStatus: {
        type: String,
        enum: ['available', 'pending', 'adopted'], // Predefined status options
        default: 'available',
    },
    dateAdded: {
        type: Date,
        default: Date.now, // Automatically set when a dog is added
    },
    ownerInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // If you have a User schema
    },
    adoptedOwnerInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // If you have a User schema
    }
});

const Dog = mongoose.model('dog', dogSchema);
module.exports = Dog;