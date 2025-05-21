require("dotenv").config();

const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    // Convert to string explicitly
    const plain = String(plainPassword);
    const hashed = String(hashedPassword);

    return await bcrypt.compare(plain, hashed);
  } catch (error) {
    console.error("Password comparison error:", error.message);
    return false;
  }
};

const createJWT = (id) => {
  return JWT.sign(
    {
      userId: id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};
module.exports = {
  hashPassword,
  comparePassword,
  createJWT,
};
