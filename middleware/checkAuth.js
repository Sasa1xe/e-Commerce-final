import jwt from "jsonwebtoken";

// runs before any protected route — checks JWT cookie, attaches user to req
export const checkAuth = (req, res, next) => {
  try {
    const token = req.cookies.node_api_token;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch {
    res.status(401).json({ error: "invalid token" });
  }
};
