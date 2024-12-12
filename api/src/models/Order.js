
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
      static associate(models) {
        Order.belongsTo(models.User, {
          foreignKey: "userId",
          as: "user",
        });
        Order.belongsToMany(models.Product, {
          through: {
            model: "Order_Product",
            unique: false,
          },
          as: "products",
          foreignKey: "orderId",
          otherKey: "productId",
          timestamps: false,
        });
      }
    }
  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      payment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};