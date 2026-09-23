import commentModel from "../../DB/models/comment.model.js";
import postModel from "../../DB/models/post.model.js"
import userModel from "../../DB/models/user.model.js";
import { fn, col } from "sequelize";

///////////////1.Create new Post (using new instance and save) (Get the post data from the body). ///
export const createPost = async (req, res, next) => {
    try {
        const { title, content, userId } = req.body;


        const post = postModel.build({ title, content, userId })
        await post.save()
        res.status(200).json({
            message: "post created successfully",
            data: post
        })
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                errors: error.errors.map((err) => err.message
                )
            })
        }
        next(error)
    }
}
/////////////2.Delete a post by its id (Ensure that only the owner of the post can perform this action)///
export const deletePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;
        const post = await postModel.findByPk(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }
        if (post.userId != userId) {
            return res.status(403).json({
                message: "You are not the owner of this post"
            });
        }
        await post.destroy();
        return res.status(200).json({
            message: "Post deleted successfully"
        });
    }
    catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                errors: error.errors.map((err) => err.message
                )
            })
        }
        next(error)
    }
};
//////////////3.Retrieve all posts, including the details of the user who created each post and the associated comments. (Showonly for the post the “id, title”, and for user “id, name”, and for the comments “id, content”)//
export const getAllPost = async (req, res, next) => {
    try {
       
     const allposts = await postModel.findAll({
         attributes: ["id", "title"],
          include: [
             {
                 model: userModel,
                  attributes: ["id", "name"] 
                },
                 {
                     model: commentModel,
                       as: "comments",
                      attributes: ["id", "content"] 
                    } ] });
        return res.status(200).json({
            message: "All Postss!!!!",
            data:allposts

        });
    }
    catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                errors: error.errors.map((err) => err.message
                )
            })
        }
        next(error)
    }
};
//////////////4. Retrieve all posts and count the number of comments associated with each post.//
export const getAllPostWcommentCount = async (req, res, next) => {
     try {
         const allposts = await postModel.findAll({
             attributes: [ "id",
                 "title",
                  [fn("COUNT", col("comments.id")), 
                    "commentsCount"] 
                ], include: 
                [ { model: commentModel, 
                    as: "comments",
                     attributes: []
                     } 
                    ], group: ["post.id", "post.title"] 
                });
                      return res.status(200).json({
                         message: "All Posts with comment count",
                          data: allposts }); 
                        } 
catch (error) {
    console.log("ERROR MESSAGE:", error.message);
    console.log("MYSQL ERROR:", error.original?.message);
    console.log("SQL:", error.original?.sql);

    next(error);
}

 };