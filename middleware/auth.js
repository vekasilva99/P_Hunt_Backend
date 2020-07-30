const jwt = require("jsonwebtoken");
const secretKey = require("../crypto/crypto");

module.exports = async ({ req, connection }) => {
  let authToken;
  if (connection) {
    authToken = connection.context.authToken;
    if (!authToken) return;
  } else {
    authToken = req.get("Authorization");
  }
  if (!authToken) {
    return;
  }

  const token = authToken.split(" ")[1];
  if (!token || token === "") {
    return;
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, secretKey);
  } catch (err) {
    return;
  }
  if (!decodedToken) {
    return;
  }
  return {
    token: decodedToken,
  };
};
