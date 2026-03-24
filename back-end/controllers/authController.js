const pool = require("../libs/db.js");
const firebaseAdmin = require("../libs/firebaseAdmin");

const { hashPassword, comparePassword, createJWT } = require("../libs/index");

const signupUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const useExist = await pool.query("select * from tbluser  where email=$1", [
      email,
    ]);
    if (useExist.rows[0]) {
      return res.status(409).json({ message: "email already exists" });
    }
    const hashedPassword = await hashPassword(password);
    console.log("Password received:", password);

    const user = await pool.query(
      `INSERT INTO tbluser (username, email, password) VALUES ($1, $2, $3) RETURNING *`,
      [username, email, hashedPassword],
    );
    const token = createJWT(user.rows[0].id);
    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // Set to true if using HTTPS
      sameSite: "strict", // CSRF protection
    });

    user.rows[0].password = undefined;

    res.status(201).json({
      status: "success",
      message: "User account created successfully",
      user: user.rows[0],
      token,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({
      message: "internal server error",
    });
  }
};

const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Email received:", email);
    console.log("Password received:", password);

    if (!email || !password) {
      return res.status(401).json({
        status: "failed",
        message: "Provide Required Fields!",
      });
    }

    const result = await pool.query(`SELECT * FROM tbluser WHERE email = $1`, [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "No account found with this email you should create one",
      });
    }

    const isMatch = await comparePassword(password, user?.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }

    const token = createJWT(user.id);
    console.log("this is your token", token);
    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });

    delete user.password;

    res.status(200).json({
      status: "success",
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);

    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        error: "Service unavailable",
        message: "Database connection failed",
      });
    }

    return res.status(500).json({
      error: "Server error",
      message: "Please try again later",
    });
  }
};
const firebaseSignup = async (req, res) => {
  try {
    // ✅ Decoded & verified by middleware
    const decodedToken = req.firebaseUser;

    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ TRUST ONLY FIREBASE TOKEN (not req.body)
    const firebase_uid = decodedToken.uid;
    const email = decodedToken.email;
    const provider = decodedToken.firebase?.sign_in_provider;

    // Optional username from client
    const { username } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email not available from provider" });
    }

    // 🔎 Check if user already exists
    const existingUser = await pool.query(
      "SELECT id, provider FROM tbluser WHERE email = $1",
      [email],
    );

    // ==============================
    // USER EXISTS
    // ==============================
    if (existingUser.rows.length > 0) {
      const user = existingUser.rows[0];

      // 🚫 Provider mismatch protection
      if (user.provider !== provider) {
        return res.status(409).json({
          message: `Email already exists with ${user.provider} provider`,
        });
      }

      // ✅ Update firebase_uid and optional username
      const result = await pool.query(
        `UPDATE tbluser SET
           firebase_uid = $1,
           username = COALESCE($2, username)
         WHERE email = $3
         RETURNING id, email, username, provider, firebase_uid, user_role`,
        [firebase_uid, username, email],
      );

      const updatedUser = result.rows[0];
      const token = createJWT(updatedUser.id);
      res.cookie("token", token, {
        maxAge: 60 * 60 * 1000, // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
      });

      return res.status(200).json({
        status: "success",
        token,
        user: updatedUser,
      });
    }

    // ==============================
    // NEW USER
    // ==============================
    const result = await pool.query(
      `INSERT INTO tbluser (
        email,
        username,
        provider,
        firebase_uid,
        password
       ) VALUES ($1, $2, $3, $4, '')
       RETURNING id, email, username, provider, firebase_uid, user_role`,
      [email, username || email.split("@")[0], provider, firebase_uid],
    );

    const newUser = result.rows[0];
    const token = createJWT(newUser.id);
    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000, // 1 hour
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });

    return res.status(201).json({
      status: "success",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error("Firebase signup error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const userAuthorization = (req, res) => {
  const token = createJWT(req.user.id);
  res.cookie("token", token, {
    maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Set to true if using HTTPS
    sameSite: "strict", // CSRF protection
  });
  try {
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        user_role: req.user.user_role,
      },
      token,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  signupUser,
  signinUser,
  firebaseSignup,
  userAuthorization,
};
