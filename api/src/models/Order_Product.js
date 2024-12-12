const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const Order_Product = sequelize.define("Order_Product", {
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Orders',
          key: 'id'
        }
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Products',
          key: 'id'
        }
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    }, {
      timestamps: false,
    });
  
    return Order_Product;
  };