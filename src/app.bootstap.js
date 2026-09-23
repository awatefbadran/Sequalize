import express from 'express'
import { connection, syncDB } from './DB/connectionDB.js';
import userRouter from './modules/users/user.controller.js';
import postRouter from './modules/posts/post.controller.js';
import "./DB/models/associations.js";
import commentRouter from './modules/comments/comment.controller.js';
const app=express();
const port =3000;

const bootstrap = async () => {
app.use(express.json())
app.get("/",(req,res,next)=>
  res.status(200).json({message:"hallo"}) );

await connection()
await syncDB()
app.use("/", userRouter);
app.use("/",postRouter);
app.use("/",commentRouter);

app.use("{/*demo}",(req,res,next)=>{
 res.status(404).json({message:`URL:${req.originalUrl} with method ${req.method} NOT FOUND`,
    statusCode:404
})
})
app.listen(port,()=>  
    console.log(`Server is running on port ${port}`)
)
}

export default bootstrap



