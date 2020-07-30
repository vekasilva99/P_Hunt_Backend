const User = require("../../../models/users");
const Product = require("../../../models/products");
const secretKey = require("../../../crypto/crypto");
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
      birthdate: new Date(user._doc.birthdate).toISOString(),
      createdAt: new Date(user._doc.createdAt).toISOString(),
      updatedAt: new Date(user._doc.updatedAt).toISOString(),
      products: products.bind(this, user._doc.products),
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createUser: async (_, args) => {
    try {
      const findUser = await User.findOne({
        mail: args.userInput.mail,
        role: args.userInput.role,
      });
      if (findUser) {
        throw new Error("User exists already");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      let user;
      let result;
      if (args.userInput.role === "VOTER") {
        user = new User({
          role: "VOTER",
          name: args.userInput.name,
          lastName: args.userInput.lastName,
          birthdate: new Date(args.userInput.birthdate).toISOString(),
          mail: args.userInput.mail,
          password: hashedPassword,
        });

        result = await user.save();
      } else if (args.userInput.role === "FOUNDER") {
        user = new User({
          role: "FOUNDER",
          name: args.userInput.name,
          lastName: args.userInput.lastName,
          birthdate: new Date(args.userInput.birthdate).toISOString(),
          mail: args.userInput.mail,
          password: hashedPassword,
        });
        result = await user.save();
      } else {
        user = new User({
          role: "ADMIN",
          name: args.userInput.name,
          lastName: args.userInput.lastName,
          birthdate: new Date(args.userInput.birthdate).toISOString(),
          mail: args.userInput.mail,
          password: hashedPassword,
        });
        result = await user.save();
      }

      console.log(result);
      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  updateUser: async (_, args) => {
    try {
      const user = await User.findById(args.updateInput.id);
      user.name = args.updateInput.name;
      user.lastName = args.updateInput.lastName;
      user.birthdate = new Date(args.updateInput.birthdate).toISOString();
      const result = await user.save();
      console.log(result);
      return { ...result._doc, _id: user.id };
    } catch (err) {
      console.log(err);
      throw err;
    }
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
    const token = jwt.sign({ userId: user.id, mail: user.mail }, secretKey, {
      expiresIn: "12h",
    });
    const loggedUser = {
      ...user._doc,
      password: null,
      birthdate: new Date(user._doc.birthdate).toISOString(),
      createdAt: new Date(user._doc.createdAt).toISOString(),
      updatedAt: new Date(user._doc.updatedAt).toISOString(),
      products: products.bind(this, user._doc.products),
    };
    return { user: loggedUser, token: token, tokenExpiration: 12 };
  },
};
