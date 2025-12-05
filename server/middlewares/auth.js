const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

module.exports = function auth(req, _res, next) {
const bearer = req.headers.authorization?.split(" ");
const cookieToken = req.cookies?.token;
let token = null;

if (bearer && bearer[0] === "Bearer") token = bearer[1];
if (!token && cookieToken) token = cookieToken;

if (!token) { req.user = null; return next(); }

try {
    req.user = jwt.verify(token, JWT_SECRET); 
} catch {
    req.user = null;
}
next();
};
