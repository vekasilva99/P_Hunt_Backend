const Product = require("../../../models/products");
const User = require("../../../models/users");

const products = async (productsIds) => {
  try {
    const products = await Product.find({ _id: { $in: productsIds } }).sort({
      createdAt: -1,
    });
    return products.map((product) => {
      return {
        ...product._doc,
        _id: product.id,
        createdAt: new Date(product._doc.createdAt).toISOString(),
        updatedAt: new Date(product._doc.updatedAt).toISOString(),
        user: user.bind(this, product.user),
      };
    });
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdAt: new Date(user._doc.createdAt).toISOString(),
      updatedAt: new Date(user._doc.updatedAt).toISOString(),
      products: products.bind(this, user._doc.products),
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  productsOrdered: async (_, args, context) => {
    return Product.find()
      .sort([
        ["createdAt", -1],
        ["votes", 1],
      ])
      .then((products) => {
        return products.map((product) => {
          return {
            ...product._doc,
            createdAt: new Date(product._doc.createdAt).toISOString(),
            updatedAt: new Date(product._doc.updatedAt).toISOString(),
            user: user.bind(this, product._doc.user),
          };
        });
      })
      .catch((err) => {
        throw err;
      });
  },
  allProducts: async (_, args, context) => {
    // if (!context.token) throw new Error("No authorized");
    try {
      const products = await Product.find();
      return products.map((product) => {
        return {
          ...product._doc,
          createdAt: new Date(product._doc.createdAt).toISOString(),
          updatedAt: new Date(product._doc.updatedAt).toISOString(),
          user: user.bind(this, product._doc.user),
        };
      });
    } catch (err) {
      throw err;
    }
  },
};
