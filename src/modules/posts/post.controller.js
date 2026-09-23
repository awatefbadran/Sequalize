import { Router } from "express";
import { createPost ,deletePost,getAllPost, getAllPostWcommentCount} from "./post.service.js";

const postRouter = Router()

postRouter.post("/post", createPost);
postRouter.delete("/posts/:postId", deletePost);
postRouter.get("/posts", getAllPost);
postRouter.get("/postswithcommentcunt", getAllPostWcommentCount);


export default postRouter
