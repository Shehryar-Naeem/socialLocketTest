import React, { createContext, useState } from "react";

const PostDetailContext = createContext();

const PostDetailProvider = ({ children }) => {
  const [isGroupMember, setIsGroupMember] = useState(false); // Replace this with your actual post detail state
  const [postDetail, setPostDetail] = useState(null); // Replace this with your actual post detail state

  return (
    <PostDetailContext.Provider
      value={{ setIsGroupMember, isGroupMember, setPostDetail, postDetail }}
    >
      {children}
    </PostDetailContext.Provider>
  );
};

export { PostDetailContext, PostDetailProvider };
