const express = require('express');
//set up an express app
const app = express();
//require morgan(is a third party middleware used as a logger)
const morgan = require('morgan');
//require mongoose
const mongoose = require('mongoose');//this mongoose variable will be used to connect to the database
//require model for the blog
const Blog = require('./models/blog');
const { render } = require('express/lib/response');
const { result } = require('lodash');

//connect to mongodb//change the pass and username to the correct ones
const dbURI = 'mongodb+srv://dbUser:dbUser@cluster0.6famr.mongodb.net/nodetutorials?retryWrites=true&w=majority';

//connecting to the database
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})//this is an asynchronous task

 .then((result)=> app.listen(3000))
 .catch((err)=> console.log(err));


//register view engine
app.set('view engine', 'ejs');


//middleware & static files
app.use(express.static('public'));

//add the middleware for reading the form to post here
app.use(express.urlencoded({ extended: true }));//takes all the encoded url data that comes along from the form and passes that into an obj that we can use on the req obj

//creating morgan middleware,.. it has various functions i.e devs, tiny
app.use(morgan('dev'));



//listening to get requests//the get handlers are also middlewares 
 app.get('/',(req, res) =>{
//redirecting this to the blogs page
    res.redirect('/blogs');

    //const blogs = [
    //    {title: 'Yoshi finds eggs', snippet:'lorem ipsum lorem ipsum lorem ipsum'},
    //    {title: 'Morio finds stars', snippet:'lorem ipsum lorem ipsum lorem ipsum'},
    //    {title: 'How to defeat bowser', snippet:'lorem ipsum lorem ipsum lorem ipsum'},
    //];
    //res.render('index', { title: 'Home', blogs });

 }); 


 app.get('/about', (req, res)=>{
     res.render('about', { title: 'About' });
 })

//these are the blog routes
app.get('/blogs', (req, res)=>{
    Blog.find().sort({ createdAt: -1 })//we can sort by a particular field inside our documents//-1 means decending order-newest to oldest(timestamps help a lot with these)
        .then(result =>{//we need to pass the array of blogs to the index.ejs file
            res.render('index', { 
                title: 'All Blogs',
                blogs: result
            })
        })
        .catch(err=>{
            console.log(err);
        });
});

//handling post requests
app.post('/blogs', (req, res)=>{
    //we want to save a new blog document to the database
    //we need access for the data from the form
    //we are going to use a middleware which is going to pass the data we send into a workable format that we can use and is going to be attached to the req object
    //it's middleware that comes along with express
    //app.use(express.urlencoded({ extended: true })); this middleware shall be added where the other middlewares are above

   // console.log(req.body);//must use the middleware to make this work
    //we have to save this to a database but first we need to create a new instance of a blog
    const blog = new Blog(req.body);

    blog.save()//saves it to the database// it is asynchronous hence it returns a promise
        .then(result=>{
            //redirect the user to see the new blog on the list
            res.redirect('/blogs');
        })
        .catch(err=>{
            console.log(err);
        })
})

app.get('/blogs/:id', (req, res)=>{
    //retrieving the id of the individual blogs document
    const id = req.params.id;
    //console.log(id);
    //now we have to retrieve the document with the specific id from the database
    Blog.findById(id)
        .then((result)=>{//we send the new blog into a view called details
            res.render('details', { blog: result, title: 'Blog Details' })
        })
        .catch((err)=>{
            console.log(err);
        });
});

//handling a delete request
app.delete('/blogs/:id', (req, res) =>{
    const id = req.params.id;

    Blog.findByIdAndDelete(id)//this is an ajax req
        .then((result)=>{
            //shall send back some json to the browser
            res.json({ redirect: '/blogs' })
        })
        .catch((err)=>{
            console.log(err);
        });

})

app.get('/blogs/create', (req, res)=>{
    res.render('create', { title: 'Create New Blog' });
}) 


 app.use((req, res)=>{
     res.status(404).render('404', { title: '404' });
 })