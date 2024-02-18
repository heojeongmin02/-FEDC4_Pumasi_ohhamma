// PostContext.js
import React, { createContext, useState } from "react";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [isPostSubmitted, setIsPostSubmitted] = useState(false);
  const [responseData, setResponseData] = useState(null);

  return (
    <PostContext.Provider
      value={{
        isPostSubmitted,
        setIsPostSubmitted,
        responseData,
        setResponseData,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
