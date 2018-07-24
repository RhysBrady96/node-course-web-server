const express = require("express");

// hbs (Handlebars), is a...
// ..."Templating engine" lets you render HTML in a dynamic way, like injecting values for date etc.
// Allows for reusable markup
const hbs = require("hbs");
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

// 
hbs.registerPartials(__dirname + "/views/partials");

// use the handlebars package as the view engine for Express!
app.set('view engine', 'hbs');



// app.use is how you define middleware and it takes a function as a parameter
// The "next" parameter in the anonymous function passed in, lets you know when your middleware has completed its tasks
// If "next" is NOT called at the end of the middleware, then the rest of the code is NEVER FIRED and the page looks unresponsive
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + "\n", (error) => {
        if (error)
        {
            console.log("Unable to append to server.log");
        }
    });
    next();
});

// NOTE: "use" is run according to the order they are written, if the static one below is 
// higher than this one, maintenence will never be shown if the user enters the static HTML files e.g.
// localhost:3000/help.html
// Whereas now, the user cannot even reach the static HTML page because the "maintenence" middleware is run first
// app.use((req, res, next) => {
//     res.render('maintenence.hbs', {
//         pageTitle : "Maintenence Page"
//     });
// });

// takes in a middleware function you want to use,
// middleware is a bit like add-ons in that they change slightly how, in this case express, is run
// dirname gets passed in from a file, the path of the directory all the way from the hard drive
app.use(express.static(__dirname + "/public"));

// Means you dont have to pass in "getCurrentYear into each of the res.render() calls,
// Instead, you call the helper within the hbs view itself!
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

// HEY its REST already :PP
// req: request coming in like headers, body, path etc
// res: bunch of available methods so you can repsond to request in any way you like
app.get("/", 
    (req, res) => {
    //     // What the user gets if they make a get request
    //     // res.send("<h1>Hello Express :3<h1>");
    //     res.send({
    //         name: "Rhys",
    //         likes: [
    //             "biking",
    //             "gaming", 
    //             "woop"
    //         ]
    //     })
    // }
        res.render('home.hbs', {
            pageTitle: "Home page",
            welcomeMessage : "Hello, welcome to the website"
            // currentYear : new Date().getFullYear() 
        })
    }
);

app.get("/about", 
    (req, res) => {
        // What the user gets if they make a get request
        // res.send("<h1>Hello Express :3<h1>");

        // render lets you render the templates using the View engine set above (hbs i.e. Handlebars)
        res.render('about.hbs', {
                pageTitle: "About page"
                // currentYear : new Date().getFullYear()
            }
        );
    }
);

app.get("/projects", 
    (req, res) => {
        res.render('projects.hbs', {
                pageTitle: "Projects page"
            }
        );
    }
);

app.get("/bad", 
    (req, res) => {
        res.send({
            error: "There was an error trying to access!"
        });
    }
)

// Binds app to a port on our machine!
// app.listen(3000);

app.listen(port, 
    () => {
        console.log(`Server is up on Port ${port}`);
    }
);
