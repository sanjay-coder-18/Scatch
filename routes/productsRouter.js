const express = require('express');
const router = express.Router();
const upload = require("../config/multer-config");
const productModel=require("../models/product-model")

router.get('/create', (req, res) => {
    res.render('createproducts', { success: req.flash('success') });
});

router.post('/create', upload.single('image'),async (req, res) => {
    // Assuming you save the product successfully
    try{
        let {name,price,discount,bgcolor,panelcolor,textcolor}=req.body
    let  product= await productModel.create({
        image:req.file.buffer,
        name,
        price,
        discount,
        bgcolor,
        panelcolor,
        textcolor
    })
    req.flash('success', 'Product created successfully');
    res.redirect("/products/create")


    }
    catch(err){
        res.send(err.message)
    }
})  

module.exports = router;
