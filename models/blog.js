const mongoose = require('mongoose');
const Schema  =  mongoose.Schema;//schema defines the structure of the docs we are going tostore inside a collection. It's the thing that a model wraps around.
//creating schema for our blogs
//the Schema above got from mongoose is a constructor function and we are going to use it to create a new schema
//storing the new schema in a constant
const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    snippet: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },//these are the three properties we want on our blog schema
}, {
    timestamps: true
})//object describes the structure of the schema
//after creating the schema we create a model based on it

//creating a model
//models are named starting with a capital letter
const Blog = mongoose.model('Blog', blogSchema);//arg1-name of model, arg2-name of scema being stored in the model
//the name of the model should be a singular of the collection name

//export this model so that we can use it elsewhere
module.exports = Blog;

//blog schema and model is now created