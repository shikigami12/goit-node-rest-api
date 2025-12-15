import fs from "fs/promises";
import path from "path";
import * as authService from "../services/authServices.js";
import { sendVerificationEmail } from "../services/emailService.js";
import HttpError from "../helpers/HttpError.js";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      throw HttpError(409, "Email in use");
    }

    const user = await authService.createUser(email, password);

    await sendVerificationEmail(user.email, user.verificationToken);

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.findUserByEmail(email);
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
      throw HttpError(401, "Email not verified");
    }

    const isValidPassword = await authService.validatePassword(
      password,
      user.password
    );
    if (!isValidPassword) {
      throw HttpError(401, "Email or password is wrong");
    }

    const token = authService.generateToken(user.id);
    await authService.updateUserToken(user.id, token);

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { id } = req.user;
    await authService.updateUserToken(id, null);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { subscription } = req.body;

    await req.user.update({ subscription });
    const updatedUser = await authService.findUserById(id);

    res.json({
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, "No file uploaded");
    }

    const { id } = req.user;
    const { path: tempPath, filename } = req.file;

    const newFilename = `${id}-${filename}`;
    const avatarsDir = path.resolve("public", "avatars");
    const newPath = path.join(avatarsDir, newFilename);

    await fs.rename(tempPath, newPath);

    const avatarURL = `/avatars/${newFilename}`;
    await authService.updateUserAvatar(id, avatarURL);

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await authService.findUserByVerificationToken(verificationToken);
    if (!user) {
      throw HttpError(404, "User not found");
    }

    await authService.verifyUser(user.id);

    res.json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await authService.findUserByEmail(email);
    if (!user) {
      throw HttpError(404, "User not found");
    }

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    await sendVerificationEmail(user.email, user.verificationToken);

    res.json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
