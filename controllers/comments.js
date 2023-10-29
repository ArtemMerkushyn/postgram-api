import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

// create comment
export const createComment = async (req, res) => {
    try {
        const user = await User.findById(req.userId); 
        const { postId, comment } = req.body;

        if(!comment) {
            return res.json({ message: 'Коментарій не може бути пустим.' });
        }

        const newComment = new Comment({ 
            comment, 
            username: user.username,
            author: req.userId
        });
        await newComment.save()

        try {
            await Post.findByIdAndUpdate(postId, {
                $push: { comments: newComment._id },
            })
        } catch (error) {
            console.log(error)
        }

        res.json(newComment)
    } catch (error) {
        res.json({ message: `Щось пішло нетак. ${error}` })
    }
}