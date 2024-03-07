import Blog from "../Schema/Blog.js";
import Notification from "../Schema/Notification.js";
import Comment from "../Schema/Comment.js";

export const likeBlog = (req, res) => {
  let user_id = req.user;

  let { _id, isLikedByUser } = req.body;

  let incrementVal = !isLikedByUser ? 1 : -1;

  // If the user is liking, like value increase by 1 otherwise descreaing by 1
  Blog.findOneAndUpdate(
    { _id },
    { $inc: { "activity.total_likes": incrementVal } }
  )
    .then((blog) => {
      if (!isLikedByUser) {
        // If user has not liked previously, adding new like and notification
        let like = new Notification({
          type: "like",
          blog: _id,
          notification_for: blog.author,
          user: user_id,
        });

        like.save().then((notification) => {
          return res.status(200).json({ liked_by_user: true });
        });
      } else {
        // If user has liked previously, removing like and notification
        Notification.findOneAndDelete({
          user: user_id,
          type: "like",
          blog: _id,
        })
          .then((result) => {
            return res.status(200).json({ liked_by_user: false });
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export const isLikedByUser = (req, res) => {
  let user_id = req.user;

  let { _id } = req.body;

  Notification.exists({ user: user_id, type: "like", blog: _id })
    .then((result) => {
      console.log(result);
      return res.status(200).json({ result });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export const addComment = (req, res) => {
  let user_id = req.user;

  let { _id, comment, replying_to, blog_author } = req.body;

  if (!comment.length) {
    return res
      .status(403)
      .json({ error: "Write something to leave a comment..." });
  }

  let commentObj = new Comment({
    blog_id: _id,
    blog_author,
    comment,
    commented_by: user_id,
  });

  commentObj.save().then((commentFile) => {
    let { comment, commentedAt, children } = commentFile;

    Blog.findOneAndUpdate(
      { _id },
      {
        $push: { comments: commentFile._id },
        $inc: { "activity.total_comments": 1 },
        "activity.total_parent_comments": 1,
      }
    ).then((blog) => {
      console.log(blog);
    });

    let notificationObj = {
      type: "comment",
      blog: _id,
      notification_for: blog_author,
      user: user_id,
      comment: commentFile._id,
    };

    new Notification(notificationObj).save().then((notification) => {
      console.log("New comment added");
    });
    return res.status(200).json({
      comment,
      commentedAt,
      _id: commentFile._id,
      user_id,
      children,
    });
  });
};

export const getComments = (req, res) => {
  let { blog_id, skip } = req.body;

  let maxLimit = 5;

  Comment.find({ blog_id, isReply: false })
    .populate(
      "commented_by",
      "personal_info.username personal_info.fullname personal_info.profile_img"
    )
    .skip(skip)
    .limit(maxLimit)
    .sort({
      commentedAt: -1,
    })
    .then((comment) => {
      return res.status(200).json(comment);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.message });
    });
};
