import express from "express";
import { registerUser, loginUser, getUserData } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();


userRouter.post('/', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/me', protect, getUserData);

export default userRouter;