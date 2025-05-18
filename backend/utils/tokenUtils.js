import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (user) => {
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
    );
    console.log("Generated Token:", token); // Debugging
    return token;
};


export const varifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log("Auth Header:", authHeader); 

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Access Denied. No Token Provided!" });
    }

    const token = authHeader.split(" ")[1];  
    console.log("Extracted Token:", token);   

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);  
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Invalid token:", error);
        return res.status(401).json({ message: "Invalid Token" });
    }
};


export const varifyownerRole = (req, res, next) => {
    if (req.user.role !== "Owner") {
        return res.status(403).json({ message: "Access Denied: Only Owners can perform this action" });
    }
    next();
};