import { Router } from "express";
import { createUser, updateUser ,getUserByEmail,getUserById} from "./user.service.js";

const userRouter = Router();

userRouter.post("/signup", createUser);
userRouter.put("/users/:id", updateUser);
userRouter.get("/userbyemail",getUserByEmail)
userRouter.get("/user/:id",getUserById)


export default userRouter;

