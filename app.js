require('dotenv').config();

const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const session=require("express-session");
const flush=require("connect-flash");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const findOrCreate=require("mongoose-findorcreate");
const https = require("https");

var GoogleStrategy = require('passport-google-oauth20').Strategy;
var origin;
var destination;
var searchUser=[];
var final;
var distanceBetween;
var timeTaken;
var person;
var detail;
var finalDetail={};



mongoose.set('strictQuery',true);

app.use(session({
    secret:"Our little secret.",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1/mediuserDB");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(flush());
const mediuserSchema=new mongoose.Schema({
    email:String,
    googleId:String,
    password:String,
    Donor:{
        name:String,
        age:Number,
        blood:String,
        Address:String,
        Contact:String,
        gender:String
    }
});
mediuserSchema.plugin(passportLocalMongoose);
mediuserSchema.plugin(findOrCreate);
const User=mongoose.model("User",mediuserSchema);


passport.use(User.createStrategy());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        username: user.username,
        picture: user.picture
      });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });
  var no="";
  var age=0;

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/donate"
  },
  function(accessToken, refreshToken, profile, cb) {
    
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
        
      return cb(err, user);
    });
  }
));

///////////////////////////////////Home///////////////////////////
app.get("/",function(req,res){
    res.render("home",{no:no,age:age});
})
app.get("/auth/google",
    passport.authenticate('google', { scope: ["profile"] })
);
app.get('/auth/google/donate', 
  passport.authenticate('google', { failureRedirect: '/signIn' }),
  function(req, res) {
    // Successful authentication, redirect Donate.
    res.redirect('/donate');
  });
//////////////////////////////////Login//////////////////////////


app.get("/signIn",function(req,res){
    res.render("signIn",{message:req.flash("message")});
})


app.post("/signIn",function(req,res){
    const user=new User({
        username:req.body.username,
        password:req.body.password
    });
    User.findOne({_id:req.user.id},function(err,foundUser){
         if(foundUser){
            req.login(user,function(err){
                if(err){
                    console.log(err);
                }
                else{
                    passport.authenticate("local")(req,res,function(){
                        res.redirect("/donate");
                       });
                }
            });
         }
         else{
            console.log("Please sign Up");
         }
    })
    
});
/////////////////////////////////////////////Logout//////////////////////////////////
app.get("/signOut",function(req,res){
    req.logout(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/");
        }
    });
    
});
////////////////////////////////////////////Donate/////////////////////////////////////
app.get("/donate",function(req,res){
    if(req.isAuthenticated()){
        res.render("donate");
        
    }
    else{

req.flash("message","Please Sign In to access the donation form");
res.redirect("/signIn");
    }
    
})


/////////////////////////////////Register///////////////////////////

app.get("/signUp",function(req,res){
    res.render("signUp");
})
app.post("/signUp",function(req,res){
User.register({username:req.body.username},req.body.password,function(err,user){
    if(err){
        console.log(err);
        res.redirect("/signUp");
    }
    else{
       passport.authenticate("local")(req,res,function(){
        res.redirect("/donate");
       })
    }
})
})
    
//////////////////////////donor////////////////////////////////
app.post("/donor",function(req,res){
    destination=req.body.address;
    const info={
        name:req.body.name,
            age:req.body.age,
            blood:req.body.blood,
            Address:req.body.address,
            Contact:req.body.contact,
            gender:req.body.gender
    }
    
    User.findByIdAndUpdate(req.user.id,{Donor:info},function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Updated Successfully");
        }
    })
    no=req.body.no;
    age=Number(req.body.age);
    res.redirect("/");
    });

    /////////////////////////////////////////Search Donor/////////////////////////////
    app.get("/search",function(req,res){
        res.render("search",{arr:searchUser});
        setTimeout(function(){
         searchUser=[];
         
        },1500)
    })
    app.post("/search",function(request,result){
        origin=request.body.add;
        var bgroup=request.body.blood;
        var radius=request.body.radii;
        User.find({"Donor.blood":bgroup}, function (err,foundUser){
            
            foundUser.forEach(element => {
            
                destination=element.Donor.Address;
               
                const api_key=process.env.MY_API;
               const geo="https://maps.googleapis.com/maps/api/distancematrix/json?origins="+origin+"&destinations="+destination+"&units=imperial&key="+api_key;

                 https.get(geo, function(response){
                     response.on("data",function(data){
                      final=JSON.parse(data);
                      distanceBetween=final.rows[0].elements[0].distance.value;
                      timeTaken=final.rows[0].elements[0].duration.text;
                      var finalAdd=final.destination_addresses;
                     if(distanceBetween<(radius*1000)){
                        person=element.Donor.name;
                        detail=element.Donor.Contact;
                        finalDetail={
                            farAway:distanceBetween,
                            duration:timeTaken,
                            person:person,
                            detail:detail,
                            homeAdd:finalAdd
                        };
                        
                        searchUser.push(finalDetail);
                        
                   }
                   else{
                    searchUser.push("message");
                   }
    })
  })
            }
            );

           
        })
        setTimeout(function(){
            result.redirect("/search");
        },2000);
        
    
    })
    ////////////////////////////////////////////////////Google Maps//////////////////////////
    app.get("/maps",function(req,res){
        res.render("map");
    })
    
    app.listen(3000,function(){
    console.log("Server has been started");
})

