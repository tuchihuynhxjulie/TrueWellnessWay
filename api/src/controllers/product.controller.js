const { Product } = require('../models');
const path = require("path");
const fs = require("fs");

const addProduct = async (req, res, next) => {
    try {
        const { name, category, price, quantity, description } = req.body;
        const newProduct = await Product.create({
            name,
            category,
            price,
            quantity,
            description,
        });
        return res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
};

const addProducts = async (req, res, next) => {
    try {
        const products = req.body;
        const newProducts = await Product.bulkCreate(products);
        return res.status(201).json(newProducts);
    } catch (error) {
        next(error);
    }
};

const getProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        return res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

const getProduct = async (productId) => {
    return await Product.findByPk(productId);
};

const getProductDetail = async (req, res, next) => {
    try {
        const id = req.query.id;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

// const getProductPicture = async (req, res, next) => {
//     try {
//         const id = req.query.id;
//         const product = await Product.findByPk(id);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
//         const image = product.image_dir;
//         // send file from directory
//         return res.status(200)
//             .sendFile(path.join(__dirname, "../../", `${image}`));
//     } catch (error) {
//         next(error);
//     }
// };

const getProductPicture = async (req, res, next) => {
    try {
        const id = req.query.id;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const image = product.image_dir;

        if (!image) {
            return res.status(400).json({ message: 'Image path is null or undefined' });
        }

        const imagePath = path.join(__dirname, "../../", image);

        // Kiểm tra tệp có tồn tại hay không
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Gửi tệp từ đường dẫn
        return res.status(200).sendFile(imagePath);
    } catch (error) {
        next(error);
    }
};


const updateProduct = async (req, res, next) => {
    try {
        const id = req.query.id;
        const { name, category, price, quantity, description, status } = req.body;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.name = name;
        product.category = category;
        product.price = price;
        product.quantity = quantity;
        product.description = description;
        product.status = status;
        // product.image_dir = image_dir;
        await product.save();
        return res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

const updateProductImage = async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const id = req.query.id;
        // find product by id
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // check if product has an image
        if (product.image_dir) {
            // delete the image
            if (product.image_dir === req.file.path) {
                return res.status(409).json({ message: 'Image Overwrited' });
            }
            // delete old image
            const originalFilePath = path.join(
                __dirname,
                "../../",
                `${product.image_dir}`
            );
            fs.unlink(originalFilePath, async (err) => {
                if (err) console.error(err);
            });
        }
        //update preview directory in database
        product.image_dir = req.file.path;
        await product.save();
        // console.log("Update Preview successfully");
        return res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (error) {
        next(error);
    }
};

const searchByKeyword = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        const products = await Product.findAll({
            where: {
                name: {
                    [Op.like]: `%${keyword}%`,
                },
            },
        });
        return res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

const searchByCategory = async (req, res, next) => {
    try {
        const { category } = req.query;
        const products = await Product.findAll({
            where: {
                category,
            },
        });
        return res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addProduct, addProducts,
    getProducts, getProduct, getProductDetail,
    getProductPicture,
    updateProduct, updateProductImage,
    searchByKeyword, searchByCategory
};
