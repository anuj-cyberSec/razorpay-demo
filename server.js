const Razorpay = require('razorpay');
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const app = express();
const cors = require('cors');

const razorpay = new Razorpay({
    key_id : 'rzp_test_rD41cDWNeyHmIo',
    key_secret :'VnNW5gHyTXQcynaXPC0gjpKp'
})


router.post('/create-order', async (req, res) => {
    console.log("&&&&&&&&&&&")
    const {amount, currency} = req.body;

    const options = {
        amount : amount * 100,
        currency : currency || 'INR',
        receipt : `receipt_${Date.now()}`,
    };
    try{
        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    }
    catch(error){
        res.status(500).json({error : 'Internal server error'})
    }
})


router.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  console.log("req.body data is ", req.body);

  const generatedSignature = crypto
    .createHmac("sha256", "VnNW5gHyTXQcynaXPC0gjpKp")
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature === razorpay_signature) {
    res.json({ status: "success" });
  } else {
    res.status(400).json({ status: "failed" });
  }
});



app.use(express.json());
app.use(cors());
// app.use('/razorpay', router);
app.use('/', router); // Use the router for all routes

// app.get('/', (req, res) => {
//     res.send('Hello from Razorpay server!');
// });
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

});