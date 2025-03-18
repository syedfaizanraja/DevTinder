const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const membershipAmount = require("../utils/membershipAmount");
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils');
const User = require("../models/user");

const express = express();
const paymentRouter = express.Router();

paymentRouter.post("/payment/create", userAuth, async (req, res) => {

    try{

        const {membershipType} = req.body;
        const {firstName, lastName,emailId} = req.user;

        // Create an order
        const order = await instance.orders.create({
            "amount": membershipAmount[membershipType] * 100,  // This is in paise = INR 500
            "currency": "INR",
            "receipt": "receipt#1",  // Should be unique for every transaction
            "partial_payment": false, // optional by default false
            "notes": {               // meta data of the user 
              firstName,
              lastName,
              emailId,
              "membershipType" : membershipType,
            },
          });

        //Save the order in the database
        const payment = new Payment({
            orderId : order.id,
            userId : req.user._id,
            amount : order.amount,
            currency : order.currency,
            receipt : order.receipt,
            status : order.status,
            notes : order.notes
        });

        const savedPayment = await payment.save();
 
        // Send the order to the client
        res.json({...savedPayment.toJSON(), keyId : process.env.RAZORPAY_KEY_ID});
    }
    catch(err){
        res.status(400).send({message : err.message});
    }

});

paymentRouter.post("/payment/webhook", async (req, res) => {
    try{
        // Verify the webhook signature
        const webhookSignature = req.headers['x-razorpay-signature'];
        const isWebhookvalid = validateWebhookSignature(JSON.stringify(req.body), webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET);
    
        if(!isWebhookvalid){
            throw new Error("Webhook Signature Mismatch");
        }

        // if webhook valid then update the payment status in the database

        const paymentDetails = req.body.payload.payment.entity;
        const payment = await Payment.findOne({orderId : paymentDetails.order_id});
        if(!payment){
            throw new Error("Payment not found");
        }
        payment.status = paymentDetails.status;
        await payment.save();

        // update the user as paid member
        const user = await User.findOne({_id : payment.userId});
        user.isPaidMember = true;
        user.membershipType = payment.notes.membershipType;
        await user.save();

        // if(req.body.event === "payment.captured"){
          
        // }

        // if(req.body.event === "payment.failed"){
      
        // }

        // return successfull response to razorpay
        return res.status(200).send({message : "Webhook received successfully"});
    }
    catch(err){
        res.status(400).send({message : err.message});
    }
});

module.exports = paymentRouter;