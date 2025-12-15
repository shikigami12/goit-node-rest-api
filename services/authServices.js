import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import User from "../db/models/User.js";

const { JWT_SECRET } = process.env;

export const findUserByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

export const createUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);
  return User.create({ email, password: hashedPassword, avatarURL });
};

export const validatePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "23h" });
};

export const updateUserToken = async (id, token) => {
  return User.update({ token }, { where: { id } });
};

export const findUserById = async (id) => {
  return User.findByPk(id);
};

export const updateUserAvatar = async (id, avatarURL) => {
  return User.update({ avatarURL }, { where: { id } });
};
