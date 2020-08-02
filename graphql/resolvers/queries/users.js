const User = require("../../../models/users");
const Product = require("../../../models/products");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const products = async (productsIds) => {
  try {
    const products = await Product.find({ _id: { $in: productsIds } });
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

const product = async (productId) => {
  try {
    const product = await Product.findById(productId);
    if (product) {
      return {
        ...product._doc,
        _id: product.id,
        createdAt: new Date(product._doc.createdAt).toISOString(),
        updatedAt: new Date(product._doc.updatedAt).toISOString(),
        user: user.bind(this, product.user),
      };
    } else {
      return null;
    }
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
      password: null,
      createdAt: new Date(user._doc.createdAt).toISOString(),
      updatedAt: new Date(user._doc.updatedAt).toISOString(),
      products: products.bind(this, user._doc.products),
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  users: (_, args, context) => {
    return User.find()
      .then((users) => {
        return users.map((user) => {
          return {
            ...user._doc,
            password: null,
            createdAt: new Date(user._doc.createdAt).toISOString(),
            updatedAt: new Date(user._doc.updatedAt).toISOString(),
            products: products.bind(this, user._doc.products),
          };
        });
      })
      .catch((err) => {
        throw err;
      });
  },

  userLogin: async (_, args, context) => {
    const user = await User.findOne({ mail: args.mail, role: args.role });
    if (!user) {
      throw new Error("User does not exist");
    }
    const isEqual = await bcrypt.compare(args.password, user.password);
    if (!isEqual) {
      throw new Error("Wrong password");
    }
    const token = jwt.sign(
      { userId: user.id, mail: user.mail },
      "somesupersecretkey",
      {
        expiresIn: "12h",
      }
    );
    const loggedUser = {
      ...user._doc,
      password: null,
      createdAt: new Date(user._doc.createdAt).toISOString(),
      updatedAt: new Date(user._doc.updatedAt).toISOString(),
      products: products.bind(this, user._doc.products),
    };
    return { user: loggedUser, token: token, tokenExpiration: 12 };
  },

  currentUser: async (_, args, context) => {
    try {
      if (!context.token) {
        return null;
      }
      const user = await User.findById(context.token.userId);
      return {
        ...user._doc,
        password: null,
        createdAt: new Date(user._doc.createdAt).toISOString(),
        updatedAt: new Date(user._doc.updatedAt).toISOString(),
        products: products
          .bind(this, user._doc.products)
          .sort({ createdAt: -1 }),
      };
    } catch (err) {
      throw err;
    }
  },
};
