//whenever you make changes to your file, stop the process and call the server again on the terminal to make sure it works with current code
//here we are creating a server manually to run in the backend
//first we are going to require http which is a core node module

const http = require('http');
//we use the above node module to create a server as below
const fs = require('fs');
//using lodash in our code, we first have to require it
const _ = require('lodash'); 

const server = http.createServer((req, res) => {//creates a server for and stores it in const server variable
    //has a callback function which will run any time a request comes into the server
    //inside the function we get access to these objects;request and response
    //req-info about the request sent from client
    //res-object used to actually send a response to a client
    //console.log('request made');//apone loading of the localhost:3000 this will be logged to the console  
    //you can log out the request made below
    //console.log(req);//outputs the request object
   // console.log(req.url, req.method);//will return /GET

   //lodash
   const num = _.random(0, 20);//gets us a random no. that's btwn 0 and 20
   console.log(num);

   const greet = _.once(()=>{//ensures the function only runs once
    console.log('hello');
});
    greet();//will only run once,..even if you call it again
    greet();//this won't run bcs it's only restricted to running once

    //the response object. First formulate the response headers
    //response headers gives the browser a little bit of info about what kind of response is coming back to it. They can also be used to set cookies.

    //set header content type;there are differnt types of headers
    res.setHeader('Content-Type', 'text/html');
    //second argument shows we are sending plain text to the browser
    //you can change it to html by typing text/html instead of text/plain. you can send an html string in the res.write(<html file>) function
    //sending the data to the browser as below
    //res.write('<h1>I am learning Nodejs</h1>');
    //res.write('<h2>I am enjoying nodejs</h2>');//this is a messy way of sending html files,..they have to be created on a seperate folder instead
    //ending the response
    //res.end();//shows that's the end of the response to be sent to the browser

    //code above is commented out to write a more efficient way of adding html files as responses
    //we shall use fs node module to read the file and write it's contents as a response, so we are going to require it up top

    //figuring out the path a user visits,... we use the request url to find that out
    let path = './views/';
    switch(req.url){
        case '/':
           path += 'index.html';
            //adding status codes to our response as below
           res.statusCode = 200;//means OK
            break;
        case '/about':
            path += 'about.html';
            //adding status codes to our response as below
            res.statusCode = 200;//means OK
            break;
        case '/about-me':
                //adding status codes to our response as below
                //redirecting this to about.html
            res.statusCode = 301;//means the resource has been moved
            //we redirect using a response header
            res.setHeader('Location', '/about');//will automatically redirect /about-me to /about
            res.end();
            break;
        default:
            path += '404.html';
            //adding status codes to our response as below
           res.statusCode = 404;//means NOT FOUD
            break;
    }
//using switch is hard while dealing with many different request urls and database logic etc, hence express is brought in to manage this in a much easier and manageable way

//then replace the './views/index.html' with path
    fs.readFile(path, (err, data)=>{//sending an html file to a browser
        if (err){
            console.log(err);
            res.end();
        }else{
           // res.write(data);//we do not need this line if we are sending one thing,..we could add it to res.end instead like below
            res.end(data);
        }
    })
});
//we have to invoke the listen method for the server to listen for requests
server.listen(3000, 'localhost', ()=>{//the arguments are the port no. that we are going to listen to, the host name i.e localhost, a function that fires when we start listening
    //means listen for requests coming to your own computer(localhost)
    console.log('listening for requests on port 3000');
});//run it to make it actively listening then send a request from the browser to this server
//when a request is made the words 'request made' will be typed out in the terminal from the function above

