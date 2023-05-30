// Import dependencies
const express = require("express");

//Linking model
const {brands,comments} = require("../models");

// Create route
const router = express.Router();

const seededData = [
    {
        name: "Rohan Odhiambo",
        style: "Image",
        website: "Photo by Rohan Odhiambo on Unsplash",
        image: "https://imgur.com/o2Wl40R",
        price: 0,
        speciality: 'Dresses'

    },
    {
        name:"Terricks Noah",       
        style:"Image",
        website:"Photo by Terricks Noah on Unsplash",
        image:"https://imgur.com/MRGc71m",
        price: 0,
        speciality: 'Dresses'

        
    },
    {
         name: "Oladimeji Odunsi",
         style: "Image",
         website: "Photo by Oladimeji Odunsi on Unsplash",  
         image: "https://imgur.com/o2Wl40R",
         price: 0,
         speciality: 'Dresses'
 
    }
]

  // Brand index route
  router.get('/', async (req, res, next) => {
    try { let myBrands;
        console.log(req.query);
        if(req.query.search) {
            myBrands = await brands.find({name: req.query.search})
            console.log(myBrands);
        } else {
            myBrands = await brands.find({})
            console.log(myBrands);
        }
        res.json(myBrands);
    } catch(err) {
        // catch error
        console.log(err);
        next();
    }

  });



  // seed route
router.get("/seed", async (req, res, next) => {
    try {
        await brands.deleteMany({});
        await brands.insertMany(seededData);
        res.redirect("/brands");
    } catch (error) {
        next();
    }
})

// new route
router.get("/new", async (req, res, next) => {
    try {
        res.render("brands/new", { user: checkCurrUser(req) });
    } catch (error) {
        next();
    }
})

// show route
router.get("/:id", async (req, res, next) => {
    try {
       
        // Grab the brand that has the corresponding ID in MongoDB
        const brand = await brands.findById(req.params.id);
        res.json(brand)
        
        // logic for getting and passing in comments

        let brandComments = await comments.find({ product: req.params.id }); //name for parity with views

        // get array of commenter names
        let brandCommentUsernames = []; //parity
        for (let i = 0; i < brandComments.length; i++) {
            const comment = brandComments[i];
            const commenter = await Users.findById(comment.user);
            brandCommentUsernames[i] = (commenter.username);
        }

        res.json("brands/show", { brand, brandComments, brandCommentUsernames, user: checkCurrUser(req), error });
    } catch (error) {
        next();
    }
})

// get edit page route
router.get("/:id/edit", async (req, res, next) => {
    try {
        const brand= await brands.findById(req.params.id);
        if (typeof req.session.currentUser.id === "undefined") {
            // if user is not logged in, tell them to login
            res.redirect("/login?error=privilege");
            return 0;
        } else if (req.session.currentUser.id !== brand.user.toString()) {
            // else if user does not have perms to edit, send this
            res.send(`<h1>It appears you can't do that.</h1>`)
            return 0;
        } else {
            // else let them edit
            res.render("brands/edit", { brand, user: checkCurrUser(req) });
        }
    } catch (error) {
        next();
    }
})

// delete confirmation route
router.get("/:id/delete", async (req, res, next) => {
    try {
        const brand = await brands.findById(req.params.id);
        if (typeof req.session.currentUser.id === "undefined") {
            // if user is not logged in, tell them to login
            res.redirect("/login?error=privilege");
            return 0;
        } else if (req.session.currentUser.id !== brand.user.toString()) {
            // else if user does not have perms to edit, send this
            res.send(`<h1>It appears you can't do that.</h1>`)
            return 0;
        }
        // else let them delete
        res.render("brands/delete", { brand, user: checkCurrUser(req) });
    } catch (error) {
        next();
    }
})



  
  // Brand create route
  router.post("/", async (req, res, next) => {
    try {
    //   send all brands
    const newBrand = req.body
    // newBrand.user = req.session.currentUser.id;
    await brands.create(req.body);
    console.log(newBrand);
    res.redirect('/brands')
      //send error
    } catch(error) {
        console.log(error);
        next();
   }
});
 
  router.put("/:id", async (req, res,next) => {
    try {
      // send all brands
      const updatedBrand = await brands.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedBrand);
    } catch (error) {
      //send error
      console.log(error);
        next();
    }
  });
  
  // Brand delete route
  router.delete("/:id", async (req, res) => {
    try {
      // send all brands
      const deletedBrand = await brands.findByIdAndRemove(req.params.id);
      res.redirect('/brands');
    } catch (error) {
      //send error
      console.log(err);
        next();
      //res.status(400).json(error);
    }
  
  });

  module.exports = router;