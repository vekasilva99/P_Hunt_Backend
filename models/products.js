const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    logo: {
      type: String,
      require: true,
    },
    images: [
      {
        type: String,
        require: false,
      },
    ],
    link: {
      type: String,
      require: true,
    },
    votes: {
      type: Number,
      default: 0,
      require: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
