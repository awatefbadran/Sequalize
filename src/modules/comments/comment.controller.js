import { Router } from "express";
import { createComments,updateComment,findOrCreateComment,searchComments,getNewest,getCommentDetails} from "./comment.service.js";

const commentRouter= Router()

commentRouter.post("/comments",createComments);
commentRouter.patch("/comments/:commentId", updateComment);
commentRouter.post("/comments/:commentId", findOrCreateComment);
commentRouter.get("/comments/search", searchComments);
commentRouter.get("/comments/newest/:postId",getNewest);
commentRouter.get("/comments/details/:id", getCommentDetails);



export default commentRouter
