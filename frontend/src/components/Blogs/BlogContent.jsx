import React from "react";

const Img = ({ url, caption }) => {
  return (
    <div>
      <img src={url} alt="" className="rounded-md" />
      {caption && (
        <p className="w-full text-center my-3 md:mb-12 text-base text-dark-grey">
          {caption}
        </p>
      )}
    </div>
  );
};
const Quote = ({ quote, caption }) => {
  return (
    <div>
      <p className="bg-purple/10 p-3 pl-5 border-l-4 border-purple rounded-sm">
        {quote}
      </p>
      {caption && <p className="w-full text-base text-purple">{caption}</p>}
    </div>
  );
};

const List = ({ style, items }) => {
  return (
    <ol className={`pl-5 ${style == "ordered" ? "list-decimal" : "list-disc"}`}>
      {items.map((listItem, i) => {
        return <li key={i} dangerouslySetInnerHTML={{ __html: listItem }}></li>;
      })}
    </ol>
  );
};

const BlogContent = ({ block }) => {
  const { type, data } = block;

  if (type == "paragraph") {
    return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>;
  }

  if (type === "header") {
    if (data.level === 3) {
      return (
        <h3
          className="text-3xl font-bold"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h3>
      );
    } else {
      return (
        <h2
          className="text-4xl font-bold"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h2>
      );
    }
  }

  if (type == "image") {
    return <Img url={data.file.url} caption={data.caption} />;
  }

  if (type == "quote") {
    return <Quote quote={data.text} caption={data.caption} />;
  }

  if (type == "list") {
    return <List style={data.style} items={data.items} />;
  }
};

export default BlogContent;
