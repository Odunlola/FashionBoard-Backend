// Import dependencies
const express = require("express");

//Linking model
const { Brands,Comments } = require("../models");

// Create route
const router = express.Router();

const seededData = [
    {
        name: "Rohan Odhiambo",
        style: "Image",
        website: "Photo by Rohan Odhiambo on Unsplash",
        image: "https://imgur.com/o2Wl40R"

    },
    {
        name:"Terricks Noah",       
        style:"Image",
        website:"Photo by Terricks Noah on Unsplash",
        image:"https://imgur.com/MRGc71m"
        
    },
    {
         name: "Oladimeji Odunsi",
         style: "Image",
         website: "Photo by Oladimeji Odunsi on Unsplash",  
         image: "https://imgur.com/o2Wl40R"
    }
]

  // Brand index route
  router.get('/', async (req, res, next) => {
    try { let myBrands;
        console.log(req.query);
        if(req.query.search) {
            myBrands = await Brands.find({name: req.query.search})
            console.log(myBrands);
        } else {
            myBrands = await Brands.find({})
            console.log(myBrands);
        }
        res.json(myBrands);
    } catch(err) {
        // If there's an error, it'll go to the catch block
        console.log(err);
        next();
    }
    // try {
    //     // send all products
    //     let myBrands = await Brands.find({});
    //     res.json({ myBrands, status: res.statusCode });
    // } catch (error) {
    //     console.log(error);
    //     res.json({ status: res.statusCode, errors: error.errors });
    // }
  });



  // seed route
router.get("/seed", async (req, res, next) => {
    try {
        await Brands.deleteMany({});
        await Brands.insertMany(seededData);
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
        // error message
        let error;
        switch (req.query.error) {
            case "invalidrating":
                error = "Invalid rating: Rating must be between 1 and 10";
                break;
            default:
                break;
        }

        // Grab the brand that has the corresponding ID in MongoDB
        const brand = await Brands.findById(req.params.id);

        // logic for getting and passing in comments

        let brandComments = await Comments.find({ product: req.params.id }); //name for parity with views

        // get array of commenter names
        let brandCommentUsernames = []; //parity
        for (let i = 0; i < brandComments.length; i++) {
            const comment = brandComments[i];
            const commenter = await Users.findById(comment.user);
            brandCommentUsernames[i] = (commenter.username);
        }

        res.render("brands/show", { brand, brandComments, brandCommentUsernames, user: checkCurrUser(req), error });
    } catch (error) {
        next();
    }
})

// get edit page route
router.get("/:id/edit", async (req, res, next) => {
    try {
        const brand= await Brands.findById(req.params.id);
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
        const brand = await Brands.findById(req.params.id);
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
    await Books.create(req.body);
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
      const updatedBrand = await Brands.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedBrand);
    } catch (error) {
      //send error
      console.log(error);
        next();
      //res.status(400).json(error);
    }
  });
  
  // Brand delete route
  router.delete("/:id", async (req, res) => {
    try {
      // send all brands
      const deletedBrand = await Brands.findByIdAndRemove(req.params.id);
      res.redirect('/brands');
    } catch (error) {
      //send error
      console.log(err);
        next();
      //res.status(400).json(error);
    }
  
  });

  module.exports = router;