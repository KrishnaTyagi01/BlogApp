var expressSanitizer = require("express-sanitizer")
var methodOverride   = require("method-override");
var bodyParser       = require("body-parser");
var mongoose         = require("mongoose");
var express          = require("express");
var app              = express();

const port = 80;
app.set("view engine","ejs");

mongoose.connect('mongodb://localhost/restful_blog_app', {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view-engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body : String,
    created : {type: Date, default: Date.now()}
  });

  var blog = mongoose.model('blog', blogSchema);

  // blog.create({
  //   title: "Test Blog",
  //   image : "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  //   body : "Hello this is a blog post"
  // });
  app.get("/", function(req,res){
    res.redirect("/blogs");
    });
  app.get("/blogs", function(req,res){
    blog.find({}, function(err, blogs){
      if(err){
        console.log(err);   
      }else{
         res.render("index", {blogs: blogs}); 
      }
    });
  });
  
app.get("/blogs/new", function(req,res){
    res.render("new");
  });

  app.get("/blogs/:id", function(req,res){
// res.send("This is show page");
   blog.findById(req.params.id, function(err, foundBlog){
     if(err){
       res.redirect("/blogs");
     }else{
       res.render("show", {blog : foundBlog});
     }
   });
  });

  app.get("/blogs/:id/edit", function(req,res){
    blog.findById(req.params.id, function(err, foundBlog){
      if(err){
        res.render("/blogs");
      }else{
        res.render("edit", {blog:foundBlog});
      }
    });  
  });

  app.post("/blogs", function(req,res){
   req.body.blog.body = req.sanitize(req.body.blog.body);

   blog.create(req.body.blog, function(err, newBlog){
     if(err){
       res.render("new");
     }else{
       res.redirect("/blogs");
     }
   });
  });

app.put("/blogs/:id", function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);

blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err, updatedBlog){
   if(err){
     res.redirect("/blogs");
   }else{
     res.redirect("/blogs/" + req.params.id);
   }
});
});

app.delete("/blogs/:id", function(req,res){
 blog.findByIdAndRemove(req.params.id,function(err){
  if(err){
    res.redirect("/blogs");
  }else{
    res.redirect("/blogs");
  }
 });
});

app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
});