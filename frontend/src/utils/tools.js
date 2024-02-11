import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";

const uploadImageByURL = (url) => {
  return Promise.resolve({
    success: 1,
    file: { url },
  });
};

const uploadImageByFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "blogapp");
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    // console.log(data.secure_url);

    return {
      success: 1,
      file: {
        url: data.secure_url,
      },
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      success: 0,
      error: error.message,
    };
  }
};

export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByURL,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading...",
      levels: [2, 3],
      defaultLevel: 2,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker: Marker,
  InlineCode: InlineCode,
};
