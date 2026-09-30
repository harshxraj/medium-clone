import Blog from "../Schema/Blog.js";
import Notification from "../Schema/Notification.js";
import Comment from "../Schema/Comment.js";
import mongoose from "mongoose";

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

  // replying_to is the comment id, of the comment, on which we got reply
  let { _id, comment, replying_to, blog_author } = req.body;

  if (!comment.length) {
    return res
      .status(403)
      .json({ error: "Write something to leave a comment..." });
  }

  let commentObj = {
    blog_id: _id,
    blog_author,
    comment,
    commented_by: user_id,
  };

  if (replying_to) {
    commentObj.parent = replying_to;
    commentObj.isReply = true;
  }

  new Comment(commentObj).save().then(async (commentFile) => {
    let { comment, commentedAt, children, parent, isReply } = commentFile;

    // If the comment is reply to some comment, then we won't increase the total_parent_comment count, otherwise we increase by 1
    Blog.findOneAndUpdate(
      { _id },
      {
        $push: { comments: commentFile._id },
        $inc: {
          "activity.total_comments": 1,
          "activity.total_parent_comments": replying_to ? 0 : 1,
        },
      }
    ).then((blog) => {
      console.log(blog);
    });

    // Also condition for the type, in notification
    let notificationObj = {
      type: replying_to ? "reply" : "comment",
      blog: _id,
      notification_for: blog_author,
      user: user_id,
      comment: commentFile._id,
    };

    // If the comment is reply, the we also add this key, which refers to comment id, on which the we got the reply
    if (replying_to) {
      notificationObj.replied_on_comment = replying_to;

      // There is a children key in comment docs, so in that key, we will push the comment id
      await Comment.findOneAndUpdate(
        { _id: replying_to },
        { $push: { children: commentFile._id } }
      ).then((replyingToCommentDoc) => {
        notificationObj.notification_for = replyingToCommentDoc.commented_by;
      });
    }

    new Notification(notificationObj).save().then((notification) => {
      console.log("New comment added");
    });
    return res.status(200).json({
      comment,
      commentedAt,
      _id: commentFile._id,
      user_id,
      children,
      parent,
      isReply,
    });
  });
};

export const getComments = (req, res) => {
  let { blog_id, skip } = req.body;

  let maxLimit = 5;

  // Use the parent relationship as the source of truth so replies created
  // before isReply was set correctly do not appear as top-level comments.
  Comment.find({ blog_id, parent: { $exists: false } })
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

export const getReplies = (req, res) => {
  let { _id } = req.body;

  Comment.findOne({ _id })
    .populate({
      path: "children",
      options: {
        sort: { commentedAt: -1 },
      },
      populate: {
        path: "commented_by",
        select:
          "personal_info.profile_img personal_info.fullname personal_info.username",
      },
      select: "-blog_id -updatedAt",
    })
    .select("children")
    .then((doc) => {
      return res.status(200).json({ replies: doc.children });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.message });
    });
};

export const deleteComment = async (req, res) => {
  const user_id = req.user;
  const { comment_id } = req.params;

  if (!mongoose.isValidObjectId(comment_id)) {
    return res.status(400).json({ error: "Invalid comment id." });
  }

  try {
    const comment = await Comment.findById(comment_id);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    if (comment.commented_by.toString() !== user_id) {
      return res
        .status(403)
        .json({ error: "You can only delete your own comments." });
    }

    const deletedCommentIds = [comment._id];
    const seenCommentIds = new Set([comment._id.toString()]);
    let childIds = comment.children || [];

    while (childIds.length) {
      const unseenChildIds = childIds.filter(
        (childId) => !seenCommentIds.has(childId.toString())
      );

      if (!unseenChildIds.length) break;

      unseenChildIds.forEach((childId) =>
        seenCommentIds.add(childId.toString())
      );

      const childComments = await Comment.find({
        _id: { $in: unseenChildIds },
      }).select("_id children");

      childIds = [];
      childComments.forEach((childComment) => {
        deletedCommentIds.push(childComment._id);
        childIds.push(...childComment.children);
      });
    }

    const parentId = comment.parent || null;
    const deletedParentCount = parentId ? 0 : 1;

    const deleteOperations = [
      Comment.deleteMany({ _id: { $in: deletedCommentIds } }),
      Notification.deleteMany({
        $or: [
          { comment: { $in: deletedCommentIds } },
          { replied_on_comment: { $in: deletedCommentIds } },
        ],
      }),
      Blog.findByIdAndUpdate(comment.blog_id, {
        $pull: { comments: { $in: deletedCommentIds } },
        $inc: {
          "activity.total_comments": -deletedCommentIds.length,
          "activity.total_parent_comments": -deletedParentCount,
        },
      }),
    ];

    if (parentId) {
      deleteOperations.push(
        Comment.findByIdAndUpdate(parentId, {
          $pull: { children: comment._id },
        })
      );
    }

    await Promise.all(deleteOperations);

    return res.status(200).json({
      deleted_comment_ids: deletedCommentIds,
      deleted_count: deletedCommentIds.length,
      deleted_parent_count: deletedParentCount,
      parent_id: parentId,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteBlog = (req, res) => {
  const user_id = req.user;

  const { blog_id } = req.body;

  Blog.findOneAndDelete({ blog_id })
    .then((blog) => {
      Notification.deleteMany({ blog: blog._id }).then((data) =>
        console.log("Notification deleted")
      );

      Comment.deleteMany({ blog_id: blog._id }).then((data) =>
        console.log("Comments deleted")
      );

      User.findOneAndUpdate(
        { _id: user_id },
        { $pull: { blog: blog._id }, $inc: { "account_info.total_posts": -1 } }
      ).then((user) => console.log("Blog Deleted"));

      return res.status(200).json({ msg: "Blog deleted!" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.message });
    });
};
