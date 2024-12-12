const { Order, Order_Product, User } = require('../models');
const { getUserId } = require('../utils/verifyToken');
const { getProduct } = require('./product.controller');

const placeOrder = async (req, res) => {
    try {
        const { products } = req.body;
        // {
        //     [
        //         product:{
        //             id, quantity
        //         }
        //     ]   
        // }
        const payment = req.body.payment || 'cash';
        var userId = req.user.id;
        if (!userId) {
            return res.status(400).json({ message: 'Invalid user' });
        }

        // verify if products exist and have enough quantity
        for (let i = 0; i < products.length; i++) {
            const product = await getProduct(products[i].id);
            if (!product) {
                return res.status(400).json({ message: 'Product ' + products[i].id + ' not found' });
            }
            if (product.quantity < products[i].quantity) {
                return res.status(400).json({ message: 'Insufficient quantity of' + product.name });
            }
        }
        // calculate total
        let total = 0;
        for (let i = 0; i < products.length; i++) {
            const product = await getProduct(products[i].id);
            total += product.price * products[i].quantity;
        }


        const newOrder = await Order.create({
            userId,
            status: 'pending',
            total,
            payment,
            products,
        });
        // Associate products with order
        for (let i = 0; i < products.length; i++) {
            const product = await getProduct(products[i].id);
            const quantity = products[i].quantity;
            await newOrder.addProduct(product, { through: { quantity } });
        }

        // if payment is banking, send back account number
        if (payment === 'banking') {
            return res.status(201).json({ message: 'Order placed', bankingInfo: 'Vietcombank\n9933808121\nDao Minh Huy' });
        }
        return res.status(201).json({ message: 'Order placed' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getOrderFromUser = async (req, res, next) => {
    try {
        var id = req.user.id;
        const orders = await Order.findAll({ where: { userId: id } });
        if (orders.length === 0) return res.status(404).json({ msg: "No order found" });
        return res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.findAll();
        if (orders.length === 0) return res.status(404).json({ msg: "No order found" });
        return res.status(200).json(orders);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

const getOrderDetails = async (req, res, next) => {
    try {
        const { id } = req.query;
        const order = await Order.findByPk(id);
        if (!order) {
            //console.log(id);
            return res.status(404).json({ message: 'Order not found' });
        }
        let user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (order.userId !== user.id && user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        let products = await Order_Product.findAll({ where: { orderId: id } });
        if (!products) {
            return res.status(404).json({ message: 'No product found' });
        }
        let productList = [];
        for (let i = 0; i < products.length; i++) {
            const product = await getProduct(products[i].productId);
            productList.push({
                id: product.id,
                product: product.name,
                category: product.category,
                quantity: products[i].quantity,
                unitPrice: Number(product.price),
            });
        }
        return res.status(200).json({
            order: order,
            products: productList,
            totalPrice: order.total,
        });

    } catch (error) {
        ``
        next(error);
    }
};

module.exports = {
    placeOrder,
    getOrderFromUser,
    getAllOrders,
    getOrderDetails,
};