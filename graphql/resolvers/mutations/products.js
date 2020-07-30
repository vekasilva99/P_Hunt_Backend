const Product = require("../../../models/products");
const User = require("../../../models/users");

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
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createProduct: async (_, args) => {
    try {
      const theuser = await User.findById(args.orderInput.user);

      const product = new Product({
        user: args.orderInput.user,
        name: args.orderInput.name,
        description: args.orderInput.description,
        logo: args.orderInput.logo,
        link: args.orderInput.deliverLat,
      });

      let createdProduct;

      createdProduct = await product.save();

      createdProduct = {
        ...createdProduct._doc,
        user: user.bind(this, args.productInput.user),
      };

      theuser.products.push(product);
      await theuser.save();

      return createdProduct;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
