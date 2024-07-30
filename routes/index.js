const express=require('express')
const router=express.Router();
const isLoggedin=require("../middlewares/isLoggedIn")
const productModel=require('../models/product-model');
const userModel = require('../models/user-model');

router.get('/',(req,res)=>{
    let error=req.flash("error")
    res.render("index",{error,loggedin:false})
})
router.get("/shop",isLoggedin,async(req,res)=>{
    let products=await productModel.find()
    let success=req.flash("success")
    res.render("shop",{products,success})
})

router.get("/cart", isLoggedin, async (req, res) => {
    try {
      let user = await userModel.findOne({ email: req.user.email }).populate("cart");
      
      const calculateBill = (cart) => {
        return cart.map(item => {
          const price = Number(item.price);
          const discount = Number(item.discount);
          const platformFee = 20;
          const shippingFee = 0; // Assuming shipping is free
          const bill = (price - discount) + platformFee + shippingFee;
          return bill;
        });
      };
  
      const bills = calculateBill(user.cart);
  
      res.render("cart", { user, bills });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });

router.get("/addtocart/:productid",isLoggedin,async(req,res)=>{
    let user=await userModel.findOne({email:req.user.email})
    user.cart.push(req.params.productid)
    await user.save()
    req.flash("sucess","Added to cart")
    res.redirect("/shop")


    
})




module.exports=router;