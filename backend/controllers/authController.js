import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const COOKIE_NAME = "devflow_token";
const tokenFor = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/"
});

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email });

export async function register(req, res, next) {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success:false, message:"Name, email and password are required" });
    if (password.length < 8) return res.status(400).json({ success:false, message:"Password must be at least 8 characters" });
    if (confirmPassword !== undefined && password !== confirmPassword) return res.status(400).json({ success:false, message:"Passwords do not match" });
    const normalizedEmail = email.trim().toLowerCase();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(409).json({ success:false, message:"Email is already registered" });
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hash });
    res.cookie(COOKIE_NAME, tokenFor(user._id), cookieOptions());
    return res.status(201).json({ success:true, message:"Registration successful", data:{ user:publicUser(user) } });
  } catch (e) { next(e); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success:false, message:"Email and password are required" });
    const user = await User.findOne({ email:email.trim().toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ success:false, message:"Invalid email or password" });
    res.cookie(COOKIE_NAME, tokenFor(user._id), cookieOptions());
    return res.json({ success:true, message:"Login successful", data:{ user:publicUser(user) } });
  } catch (e) { next(e); }
}

export function logout(req, res) {
  res.clearCookie(COOKIE_NAME, { httpOnly:true, secure:process.env.NODE_ENV === "production", sameSite:"lax", path:"/" });
  return res.json({ success:true, message:"Logout successful", data:{} });
}

export function me(req, res) {
  res.json({ success:true, message:"User fetched successfully", data:{ user:req.user } });
}
