const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user and attach to request
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

const staff = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "employee")) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as staff member" });
  }
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      return next();
    }
    if (req.user && req.user.role === "employee" && req.user.permissions && req.user.permissions[permission]) {
      return next();
    }
    res.status(403).json({ message: `Insufficient permissions: ${permission} required` });
  };
};

module.exports = { protect, admin, staff, checkPermission };
