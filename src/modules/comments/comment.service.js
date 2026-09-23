import commentModel from "../../DB/models/comment.model.js"
import { Op } from "sequelize";
import postModel from "../../DB/models/post.model.js";
import userModel from "../../DB/models/user.model.js";
///////////// 1. Create a bulk of Comments
export const createComments = async (req, res, next) => {
    try {
        const comments = req.body;
        const newComments = await commentModel.bulkCreate(comments);
        return res.status(201).json({
            message: "Comments created successfully",
            data: newComments
        });
    }
    catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                errors: error.errors.map((err) => err.message
                )
            });
        }
        next(error);
    }
};
//////////////2. Update the content of a specific comment by its ID. (Ensure that onlaction) (The user id that wants to perform this action will be given in the body)
export const updateComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { userId, content } = req.body;
        const comment = await commentModel.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if (comment.userId != userId) {
            return res.status(403).json({ message: "You are not the owner of this comment" });
        }
        comment.content = content;
        await comment.save();
        return res.status(200).json({
            message: "Comment updated successfully",
            data: comment
        });
    }
    catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                errors: error.errors.map((err) => err.message
                )
            });
        }
        next(error);
    }
};
/////////3.find a comment for a specific post, user, and content. If the comment exists, return it, otherwise, create a newcomment with the given details.
export const findOrCreateComment = async (req, res, next) => {
    try {
        const { userId, postId, content } = req.body;

        const [comment, created] = await commentModel.findOrCreate({
            where: { userId, postId, content },
            defaults: { userId, postId, content }
        });

        return res.status(created ? 201 : 200).json({
            message: created
                ? "Comment created successfully"
                : "Comment already exists",
            data: comment
        });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                errors: error.errors.map((err) => err.message)
            });
        }

        next(error);
    }
};
/////////4. Retrieve all comments that contain a specific word in their content and return the number of comments matched(use find and count). (0.5 Grade) URL: GET /comments/search => (for example /comments/search?word=the)
export const searchComments = async (req, res, next) => {
    try {
        const { word } = req.query;
        const { rows, count } = await commentModel.findAndCountAll({
            where: {
                content: {
                    [Op.like]: `%${word}%`
                }
            }
        });
        return res.status(200).json({
            message: "Comments found successfully",
            count, data: rows
        });
    }
    catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                errors: error.errors.map((err) => err.message)
            });
        }

        next(error);
    }
};
////////////5.Retrieve the 3 most recent comments for a specific post, ordered by creation date.
export const getNewest = async (req, res, next) => {
    try {
        const { postId } = req.params;

        const comments = await commentModel.findAll({
            where: {
                postId
            },
            order: [["createdAt", "DESC"]],
            limit: 3
        });

        return res.status(200).json({
            message: "Newest comments retrieved successfully",
            data: comments
        });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                errors: error.errors.map((err) => err.message)
            });
        }

        next(error);
    }
};
///////////6.Get Specific Comment By PK with User and Post Information. 
export const getCommentDetails = async (req, res, next) => {
    try {
        const { id } = req.params;

        const comment = await commentModel.findByPk(id, {
            include: [
                {
                    model: userModel,
                    attributes: ["id", "name"]
                },
                {
                    model:postModel,
                    as: "post",
                    attributes: ["id", "title", "content"]
                }
            ]
        });

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        return res.status(200).json({
            message: "Comment found successfully",
            data: comment
        });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                errors: error.errors.map((err) => err.message)
            });
        }

        next(error);
    }
};

