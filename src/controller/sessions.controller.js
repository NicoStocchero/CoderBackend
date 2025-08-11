import jwt from "jsonwebtoken";

export const TOKEN_COOKIE = "token";
const JWT_SECRET = process.env.JWT_SECRET || "devSecretChangeMe";

const sanitizeUser = (user) => {
  if (!user) return null;
  const plain = user.toObject ? user.toObject() : user;
  const { password, __v, ...rest } = plain;
  return rest;
};

export const registerController = async (req, res) => {
  return res.status(201).json({ message: "User created" });
};

export const loginController = async (req, res) => {
  try {
    const safeUser = sanitizeUser(req.user);
    const token = jwt.sign({ user: safeUser }, JWT_SECRET, { expiresIn: "1d" });

    res.cookie(TOKEN_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Guardar datos del usuario en la sesión para vistas server-side
    req.session.user = {
      _id: safeUser._id,
      first_name: safeUser.first_name,
      last_name: safeUser.last_name,
      email: safeUser.email,
      role: safeUser.role || "user",
      cart: safeUser.cart || null,
      age: safeUser.age || null,
      createdAt: safeUser.createdAt || null,
    };

    return res.json({ message: "Login successful", user: req.session.user });
  } catch (err) {
    return res.status(500).json({ message: "Login failed" });
  }
};

export const currentController = (req, res) => {
  const safeUser = sanitizeUser(req.user);
  return res.json({ user: safeUser });
};

export const logoutController = (req, res) => {
  res.clearCookie(TOKEN_COOKIE);
  if (req.session) {
    req.session.destroy(() => res.json({ message: "Logged out" }));
  } else {
    res.json({ message: "Logged out" });
  }
};
