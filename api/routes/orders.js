const express = require('express');
const router = express.Router();

router.get('/', (req, res,next) => {
    res.status(200).json({
        message : 'Order get',
    });
});

router.post('/', (req, res,next) => {
    const order = {
        productId : req.body.productId,
        quantity : req.body.quantity,
    };
    res.status(201).json({
        message : 'Order created',
        order : order
    });
});

router.get('/:orderId', (req, res,next) => {
    const id = req.params.orderId;

    res.status(200).json({
        message : 'Order Details ',
        id : id,
    });
});


// router.patch('/:productId', (req, res,next) => {
//     const id = req.params.productId;

//     res.status(200).json({
//         message : 'product updated',
//         id : id,
//     });
// });


router.delete('/:orderId', (req, res,next) => {
    const id = req.params.productId;

    res.status(200).json({
        message : 'order deleted',
        id : id,
    });
});

module.exports = router ;
