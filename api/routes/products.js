const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pathF = path.join(__dirname, "../images");


// file upload fun
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      
    console.log(pathF);
      if (!fs.existsSync(pathF)) {
        fs.mkdirSync(pathF,{
          recursive: true,
        });
      }

      cb(null, pathF);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      // console.log(cb(null, uniqueSuffix + file.originalname));
      cb(null, uniqueSuffix + file.originalname);
    }
  })
  
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
  
  
  const fileUpload = multer({
    storage: storage, limits: {
      fileSize: 1024*1024*5,
    },
    fileFilter: fileFilter,
  });



router.get("/", (req, res, next) => {
  Product.find().exec().then(doc =>{
      console.log(doc);
      res.status(200).json(doc);
  }).catch(err=>{
      console.log(err);
      res.status(500).json(err);
  });
});

router.post("/", async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    message: "product post",
    createProduct: product,
  });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then((doc) => {
      console.log(doc);
      if(doc)
      {
          res.status(200).json(doc);
      }else{
          res.status(404).json({
            message : "Product not found",
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps={};
  for(const ops of req.body)
  {
    updateOps[ops.propName]=ops.value;

  }
    Product.updateOne({_id: id}, {$set: updateOps}) .exec()
    .then((doc) => {
      console.log(doc);
      if(doc)
      {
          res.status(200).json(doc);
      }else{
          res.status(404).json({
            message : "Product not found",
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
//   res.status(200).json({
//     message: "product updated",
//     id: id,
//   });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;

  Product.remove({ _id:id }).exec().then((doc) => {
    console.log(doc);
    if(doc)
    {
        res.status(200).json(doc);
    }else{
        res.status(404).json({
          message : "Product not found",
        });
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.post("/img", fileUpload.single("post_image"), async (req, res, next) => {
 
  res.status(201).json({
    message: "Image Uploaded ",
  });

});

module.exports = router;
