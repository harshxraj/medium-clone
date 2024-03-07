import React from "react";
import { getDay, getFullDayWithTime } from "../../common/Date";
import { useSelector } from "react-redux";

const CommentCard = ({ index, leftVal, commentData }) => {
  const {
    comment,
    commented_by: {
      personal_info: { profile_img, fullname, username },
    },
    commentedAt,
  } = commentData;
  console.log("COMMENTDATA", commentData);

  return (
    <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className="my-5 p-6 rounded-md border border-grey">
        <div className="flex gap-3 items-center mb-8">
          {profile_img && (
            <img src={profile_img} className="w-6 h-6 rounded-full" />
          )}

          <p className="line-clamp-1 font-medium capitalize">{fullname}</p>
          <p className="min-w-fit text-dark-grey">
            {getFullDayWithTime(commentedAt)}
          </p>
        </div>

        <p className="font-gelasio text-xl ml-3">{comment}</p>
      </div>
    </div>
  );
};

export default CommentCard;
