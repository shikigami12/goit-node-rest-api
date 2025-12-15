import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  registerSchema,
  loginSchema,
  subscriptionSchema,
  emailSchema,
} from "../schemas/authSchemas.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);

authRouter.post("/login", validateBody(loginSchema), login);

authRouter.get("/verify/:verificationToken", verifyEmail);

authRouter.post("/verify", validateBody(emailSchema), resendVerificationEmail);

authRouter.post("/logout", auth, logout);

authRouter.get("/current", auth, getCurrentUser);

authRouter.patch(
  "/subscription",
  auth,
  validateBody(subscriptionSchema),
  updateSubscription
);

authRouter.patch("/avatars", auth, upload.single("avatar"), updateAvatar);

export default authRouter;
