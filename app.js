//jshint esversion:6

const express = require("express"); // require the express module
const bodyParser = require("body-parser"); // require the body-parser module
const mongoose = require("mongoose"); // require the mongoose module
const ejs = require("ejs"); // require the ejs module
const _ = require('lodash'); // require the lodash module

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express(); // create a new express app instance

// let posts = []; // create an empty array to store posts

app.set('view engine', 'ejs'); // set the view engine to ejs

app.use(bodyParser.urlencoded({ extended: true })); // use the body-parser module
app.use(express.static("public")); // use the public folder

mongoose.connect("mongodb://localhost:27017/blogDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const postSchema = {
    title: String,
    content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) { // "/" is the home route
    Post.find().then(posts => {
        res.render("home", {
            startingContent: homeStartingContent,
            posts: posts
        });
    });
    // res.render("home", { startingContent: homeStartingContent, posts: posts }); // render the home.ejs file
});

// app.get("/", async function(req, res) { // "/" is the home route
//     try {
//         const posts = await Post.find({}); // find all the posts in the database
//         res.render("home", {
//             startingContent: homeStartingContent,
//             posts: posts
//         });
//     } catch (err) {
//         console.error(err);
//     }
// });

app.get("/about", function(req, res) { // "/" is the home route
    res.render("about", { aboutContent: aboutContent }); // render the about.ejs file
});

app.get("/contact", function(req, res) { // "/" is the home route
    res.render("contact", { contactContent: contactContent }); // render the contact.ejs file
});

app.get("/compose", function(req, res) { // "/" is the home route
    res.render("compose"); // render the compose.ejs file
});

// app.post("/compose", function(req, res) { // "/" is the home route
//     const post = new Post({
//         title: req.body.postTitle, // get the title from the form
//         content: req.body.postBody // get the content from the form
//     });
//     // post.save(); // save the post to the database
//     // posts.push(post); // push the post to the posts array
//     post.save(function(err) {
//         if (!err) {
//             res.redirect("/");
//         }
//         // });
//     });
// });

app.post("/compose", function(req, res) {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
    });

    post.save()
        .then(() => {
            res.redirect("/");
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error saving post to database");
        });
});


// app.get("/posts/:postId", function(req, res) {
//     const requestedPostId = req.params.postId;
//     Post.findOne({ _id: requestedPostId }, function(err, post) {
//         res.render("post", {
//             title: post.title,
//             content: post.content
//         });
//     });
// });

app.get("/posts/:postId", async function(req, res) {
    const requestedPostId = req.params.postId;
    try {
        const post = await Post.findOne({ _id: requestedPostId });
        res.render("post", {
            title: post.title,
            content: post.content
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving post");
    }
});


app.get("/posts/:postName", function(req, res) { // "/" is the home route
    const requestedTitle = _.lowerCase(req.params.postName); // get the title from the url
    posts.forEach(function(post) { // loop through the posts array
        const storedTitle = _.lowerCase(post.title); // get the title from the posts array
        if (storedTitle === requestedTitle) { // if the title from the url matches the title from the posts array
            // console.log("Match found!"); // log "Match found!"
            res.render("post", { // render the post.ejs file
                title: post.title, // pass the title to the post.ejs file
                content: post.content // pass the content to the post.ejs file
            });
        }
    });
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});