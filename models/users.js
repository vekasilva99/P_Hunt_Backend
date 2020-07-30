const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    role: {
      type: String,
      require: true,
    },
    mail: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
