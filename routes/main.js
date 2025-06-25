const express=require('express');
const multer = require('multer');
const router=express.Router();
const Post=require('../models/post');
const path = require('path');
//const Comment = require('../models/comment');
const User=require('../models/user');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({storage: storage});

router.get('/home', async (req, res) => {
    try {
      const locals = {
        title: "College Deets",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }
  
      let perPage = 7;
      let page = req.query.page || 1;
  
      // const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
      // .skip(perPage * page - perPage)
      // .limit(perPage)
      // .populate('createdBy')
      // .exec();
      const data = await Post.aggregate([
        { $sort: { createdAt: -1 } },
        { $skip: perPage * page - perPage },
        { $limit: perPage },
        {
            $lookup: {
                from: 'users', // the collection name in MongoDB for your 'createdBy' model
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy'
            }
        },
        { $unwind: '$createdBy' } // Optionally, if you expect only one `createdBy` per post
    ]);
    
  
      // Count is deprecated - please use countDocuments
      // const count = await Post.count();
      const count = await Post.countDocuments({});
      const nextPage = parseInt(page) + 1;
      const hasNextPage = nextPage <= Math.ceil(count / perPage);
   const user=req.user;
      res.render('index', { 
        user,
        locals,
        data,
        current: page,
        nextPage: hasNextPage ? nextPage : null,
        
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });
  



/**
 * GET /
 * Post :id
*/
router.get('/post/:id', async (req, res) => {
    try {
      
  
      const data = await Post.findById(req.params.id ).populate("createdBy");
      
  
      const locals = {
        title: data.title,
        description: "Simple Blog created with NodeJs, Express & MongoDb.",
      }
  
      res.render('post', { 
        locals,
        data,
        
        
      });
    } catch (error) {
      console.log(error);
    }
  
  });


router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    res.render("search", {
     
      data,
      locals,
      
    });

  } catch (error) {
    console.log(error);
  }

});

router.get('/add-post',  async (req, res) => {
  try {
    const locals = {
      title: 'Add Post',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }

    const data = await Post.find();
    res.render('add-post', {
   
      locals,
      
    });

  } catch (error) {
    console.log(error);
  }

});



/**
 * POST /
 * Admin - Create New Post
*/
router.post('/add-post', upload.single("coverImage"), async (req, res) => {
  try {
    try {
       
      const { title, body} = req.body;
      const blog = await Post.create({
        body,
        title,
        createdBy: req.user.id,
        coverImageURL: `/uploads/${req.file.filename}`
    });
   
    return res.redirect(`/main/post/${blog._id}`);
    } catch (error) {
      console.log(error);
    }

  } catch (error) {
    console.log(error);
  }
});

router.get('/edit-post/:id', async (req, res) => {
  try {

    const locals = {
      title: "Edit Post",
      description: "Free NodeJs User Management System",
    };

    const data = await Post.findOne({ _id: req.params.id });
    if (!data) {
      return res.status(404).send("Blog not found");
  }
    res.render('edit-post', {
  
      locals,
      data,
      
    })

  } catch (error) {
    console.log(error);
  }

});

router.put('/edit-post/:id', async (req, res) => {
  try {
    let updateData = {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
  };
  
  if (req.file) {
    updateData.coverImageURL = `/uploads/${req.file.filename}`;
}
    await Post.findByIdAndUpdate(
      req.params.id,
      updateData, 
      { new: true, runValidators: true }
    );

    res.redirect('/main/home');

  } catch (error) {
    console.log(error);
  }

});


router.delete('/delete-post/:id', async (req, res) => {

  try {
    await Post.deleteOne( { _id: req.params.id } );
    res.redirect('/main/home');
  } catch (error) {
    console.log(error);
  }

});

 module.exports=router;