// import React from "react";

// const Tag = ({ tag }) => {
//   return (
//     <div className="relative p-2 mt-2 mr-2 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
//       <p className="outline-none" contentEditable="true">
//         {tag}
//       </p>
//       <button className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2">
//         <i className="fi fi-br-cross text-sm pointer-events-none"></i>
//       </button>
//     </div>
//   );
// };

// export default Tag;
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTags } from "../../redux/blogEditorSlice";

const Tag = ({ tag }) => {
  const [content, setContent] = useState(tag);
  let { tags } = useSelector((store) => store.blogEditor);
  const dispatch = useDispatch();

  const handleInput = (e) => {
    setContent(e.target.innerText);
  };

  const handleTagDelete = () => {
    const newTags = tags.filter((t) => t !== tag);
    dispatch(setTags(newTags));
  };

  return (
    <div className="relative p-2 mt-2 mr-2 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
      <div
        className="outline-none"
        // contentEditable="true"
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <button
        onClick={handleTagDelete}
        className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"
      >
        <i className="fi fi-br-cross text-sm pointer-events-none"></i>
      </button>
    </div>
  );
};

export default Tag;
