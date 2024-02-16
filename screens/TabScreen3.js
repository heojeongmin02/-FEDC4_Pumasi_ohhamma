// TabScreen3.js

import React, { useEffect, useState } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  ScrollView,
  Button,
  Pressable,
} from "react-native";
import { idToken, userId } from "./LoginScreen";

const styles = StyleSheet.create({
  tabHeader: {
    height: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  tabHeaderText: {
    marginTop: 50,
    marginLeft: 30,
    fontSize: 24,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: 20, // 스크롤 가능한 내용 아래 여백
  },
  box: {
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 15,
    marginHorizontal: 15,
  },
  contentContainer: {
    flex: 1,
  },
  largeText: {
    fontSize: 24,
    fontWeight: "normal",
  },
  contentText: {
    fontSize: 15,
    marginTop: 5,
    marginBottom: 3,
  },
  toggleButton: {
    backgroundColor: "#A5D699",
    marginTop: 50,
    marginRight: 15,
    padding: 10,
    borderRadius: 10,
  },
  toggleButtonText: {
    color: "white",
    fontSize: 16,
    paddingHorizontal: 5,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "95%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    elevation: 5,
  },
  modalCloseButton: {
    marginTop: 10,
    alignItems: "center",
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 10,
    padding: 8,
    marginTop: 5,
    marginBottom: 5,
  },
  largeInputField: {
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 10,
    padding: 8,
    marginTop: 5,
    marginBottom: 5,
    height: 70,
  },
  closeButtonText: {
    color: "#D5D5D5",
    fontSize: 15,
    fontWeight: "bold",
  },
  iosShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  androidShadow: {
    elevation: 5,
  },
  modalPostButton: {
    backgroundColor: "#A5D699",
    marginTop: 10,
    marginBottom: 5,
    padding: 17,
    borderRadius: 15,
    alignItems: "center",
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  commentContainer: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 0,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  userName: {
    fontWeight: "700",
    fontSize: 15,
    color: "#333",
    marginBottom: 5,
  },
  comment: {
    fontSize: 14,
    color: "#444",
  },
  commentContentText: {
    fontSize: 15,
    marginTop: 10,
    marginBottom: 0,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentButton: {
    backgroundColor: "#A5D699",
    marginTop: 10,
    marginBottom: 5,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  commentInputField: {
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 10,
    width: 315,
    padding: 8,
    marginTop: 10,
    marginBottom: 5,
  },
  viewModalCloseButton: {
    marginTop: 18,
    alignItems: "center",
  },
  likedButton: {
    backgroundColor: "#A5D699",
    padding: 5,
    borderRadius: 10,
    marginRight: 10,
  },
  likedButtonText: {
    color: "white",
    fontSize: 15,
  },
  unlikedButton: {
    padding: 5,
    borderRadius: 10,
    marginRight: 10,
  },
});

const API_BASE_URL = "http://pumasi.everdu.com/community";

const TabHeader = ({ name, onPressPublish }) => (
  <View style={styles.tabHeader}>
    <Text style={styles.tabHeaderText}>{name}</Text>
    <TouchableOpacity style={styles.toggleButton} onPress={onPressPublish}>
      <Text style={styles.toggleButtonText}>게시</Text>
    </TouchableOpacity>
  </View>
);

const ContentBox = ({ post, onView, onDelete, onUpdate, onLike }) => {
  const isUserPost = post.author === userId;
  const [isLiked, setIsLiked] = useState(false);

  const handleDelete = () => {
    // Confirm deletion before proceeding
    Alert.alert(
      "삭제 확인",
      "정말 삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "확인",
          onPress: () => onDelete(post),
        },
      ],
      { cancelable: false }
    );
  };

  const handleLike = () => {
    setIsLiked(true);
    onLike(post);
  };

  return (
    <TouchableOpacity style={styles.box} onPress={() => onView(post)}>
      <Text style={styles.largeText}>{post.title}</Text>
      <Text style={styles.contentText}>{post.content}</Text>
      <View
        style={{
          marginTop: 5,
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        <TouchableOpacity
          onPress={() => handleLike()}
          style={isLiked ? styles.likedButton : styles.unlikedButton}
        >
          <Text style={isLiked ? styles.likedButtonText : { color: "#808080" }}>
            {post.like} 좋아요
          </Text>
        </TouchableOpacity>
        {isUserPost && (
          <>
            <TouchableOpacity
              onPress={() => onUpdate(post)}
              style={{ marginLeft: "auto" }}
            >
              <Text style={{ color: "#808080", marginRight: 10, marginTop: 5 }}>
                수정
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Text style={{ color: "#808080", marginTop: 5 }}>삭제</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const ChatComponent = ({
  comment,
  userName,
  user_email,
  content,
  onDelete,
}) => {
  const isUserComment = user_email === userId;
  const handleDelete = () => {
    // Confirm deletion before proceeding
    Alert.alert(
      "삭제 확인",
      "정말 삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "확인",
          onPress: () => onDelete(comment),
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <View style={styles.commentContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.userName}>{userName}</Text>
        {isUserComment && (
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <TouchableOpacity onPress={handleDelete}>
              <Text style={{ color: "#808080", marginTop: 0 }}>삭제</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Text style={styles.comment}>{content}</Text>
    </View>
  );
};

const TabScreen3 = () => {
  const [posts, setPosts] = useState([]);
  const [thePost, setThePost] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentPostId, setCurrentPostId] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    point: "",
    address: "",
    introduce: "",
  });
  const [newPostContent, setNewPostContent] = useState({
    author: `${userId}`,
    author_address: `${userData.address}`,
    comment_count: 0,
    created_date: "",
    like: 0,
    modify_date: "",
    tag: ["생활", "일상"],
    topic: "생활",
    title: "",
    content: "",
  });
  const [modifiedContent, setModifiedContent] = useState({
    author: `${userId}`,
    author_address: `${userData.address}`,
    comment_count: 0,
    created_date: "",
    like: 0,
    modify_date: "",
    tag: ["생활", "일상"],
    topic: "생활",
    title: "",
    content: "",
  });
  const [isPublishModalVisible, setPublishModalVisible] = useState(false);
  const [isModifyModalVisible, setModifyModalVisible] = useState(false);
  const [isViewModalVisible, setViewModalVisible] = useState(false);

  // 0. 날짜 포맷 함수
  const formatDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
  };

  // 1. 글의 리스트를 조회하는 함수
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${idToken}`,
        },
      });
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  // 2. 특정 글을 조회하는 함수
  const fetchPostById = async (post) => {
    try {
      const response = await fetch(`${API_BASE_URL}/post/${post.post_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${idToken}`,
        },
      });
      const data = await response.json();
      setThePost(data);
      setCurrentPostId(post.post_id);
      setViewModalVisible(true);
    } catch (error) {
      console.error(`Error fetching post ${post.post_id}:`, error);
    }
  };

  // 3. 특정 글을 삭제하는 함수
  const deletePost = async (post) => {
    try {
      const response = await fetch(`${API_BASE_URL}/post/${post.post_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${idToken}`,
        },
      });
      if (response.ok) {
        console.log(`Post ${post.post_id} deleted successfully`);
        fetchPosts(); // Refresh the post list after deletion
      } else {
        console.error(`Error deleting post ${post.post_id}`);
      }
    } catch (error) {
      console.error(`Error deleting post ${post.post_id}:`, error);
    }
  };

  // 4. 특정 글을 수정하는 함수
  const updatePost = async () => {
    currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    const updatedContent = {
      ...modifiedContent,
      modify_date: formattedDate,
    };

    setModifiedContent(updatedContent);
    console.log(updatedContent);

    try {
      const response = await fetch(
        `${API_BASE_URL}/post/${updatedContent.post_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${idToken}`,
          },
          body: JSON.stringify(updatedContent),
        }
      );
      if (response.ok) {
        console.log(`Post ${updatedContent.post_id} updated successfully`);
        setModifyModalVisible(false); // Close the modify modal
        fetchPosts(); // Refresh the post list after update
      } else {
        console.error(`Error updating post ${updatedContent.post_id}`);
      }
    } catch (error) {
      console.error(`Error updating post ${updatedContent.post_id}:`, error);
    }
  };

  // 5. 새로운 글을 생성하는 함수
  const createPost = async () => {
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);

    // Update the state
    setNewPostContent({
      ...newPostContent,
      author: `${userId}`,
      author_address: `${userData.address}`,
      comment_count: 0,
      like: 0,
      tag: ["생활", "일상"],
      topic: "생활",
      created_date: formattedDate,
      modify_date: formattedDate,
    });
  };

  // 6. 글 생성을 보조하는 함수
  useEffect(() => {
    const postRequest = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/post`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${idToken}`,
          },
          body: JSON.stringify(newPostContent),
        });

        if (response.ok) {
          console.log("Post created successfully");
          fetchPosts(); // Refresh the post list after creation
          setNewPostContent({ title: "", content: "" }); // Clear the input fields
          setPublishModalVisible(false); // Close the publish modal
        } else {
          console.error("Error creating post", response.statusText);
        }
      } catch (error) {
        console.error("Error creating post:", error);
      }
    };

    // Check if newPostContent has changed before making the request
    if (newPostContent.created_date) {
      postRequest(); // Call the postRequest function
    }
  }, [newPostContent]); // Depend on newPostContent to trigger the useEffect

  const onPressPublish = () => {
    setPublishModalVisible(true);
  };

  // 7. 유저 정보를 조회하는 함수
  useEffect(() => {
    // Fetch posts when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://pumasi.everdu.com/user/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${idToken}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setUserData(result);
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPosts();
    fetchData();
  }, []);

  // 8. 글 업데이트를 보조하는 함수
  const handleUpdate = (post) => {
    setModifiedContent({
      author: post.author,
      author_address: post.author_address,
      comment_count: post.comment_count,
      created_date: post.created_date,
      like: post.like,
      tag: post.tag,
      topic: post.topic,
      title: post.title,
      content: post.content,
      post_id: post.post_id,
    });
    console.log(modifiedContent);
    setModifyModalVisible(true);
  };

  // 9. 댓글을 추가하는 함수
  const addComment = async (newComment) => {
    const comment = {
      content: newComment,
    };
    console.log(currentPostId);
    try {
      const response = await fetch(
        `${API_BASE_URL}/post/${currentPostId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${idToken}`,
          },
          body: JSON.stringify(comment),
        }
      );

      if (response.ok) {
        console.log("Comment added successfully");
        setNewComment(""); // Clear the input field
        setViewModalVisible(false); // Close the view modal
        try {
          const response = await fetch(
            `${API_BASE_URL}/post/${currentPostId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${idToken}`,
              },
            }
          );
          const data = await response.json();
          setThePost(data);
          setViewModalVisible(true);
        } catch (error) {
          console.error(`Error fetching post ${currentPostId}:`, error);
        }
      } else {
        console.error("Error adding comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // 10. 댓글을 삭제하는 함수
  const deleteComment = async (comment) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/post/${currentPostId}/comment/${comment.comment_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${idToken}`,
          },
        }
      );

      if (response.ok) {
        console.log("Comment deleted successfully");
        setViewModalVisible(false); // Close the view modal
        try {
          const response = await fetch(
            `${API_BASE_URL}/post/${currentPostId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${idToken}`,
              },
            }
          );
          const data = await response.json();
          setThePost(data);
          setViewModalVisible(true);
        } catch (error) {
          console.error(`Error fetching post ${currentPostId}:`, error);
        }
      } else {
        console.error("Error deleting comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // 11. 글 좋아요를 추가하는 함수
  const addLike = async (post) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/post/${post.post_id}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${idToken}`,
          },
        }
      );

      if (response.ok) {
        console.log("Like added successfully");
        fetchPosts(); // Refresh the post list after like
      } else {
        console.error("Error adding like:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding like:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TabHeader name="커뮤니티" onPressPublish={onPressPublish} />
      <View style={styles.contentContainer}>
        {/* Posts rendering */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {posts &&
            posts.map((post) => (
              <ContentBox
                key={post.post_id}
                post={post}
                onView={fetchPostById}
                onDelete={deletePost}
                onUpdate={handleUpdate}
                onLike={addLike}
              />
            ))}
        </ScrollView>

        {/* Publish Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isPublishModalVisible}
          onRequestClose={() => setPublishModalVisible(false)}
        >
          <View
            style={[
              styles.modalContainer,
              Platform.OS === "android"
                ? styles.androidShadow
                : styles.iosShadow,
            ]}
          >
            <View style={styles.modalContent}>
              <TextInput
                style={styles.inputField}
                placeholder="글의 제목"
                value={newPostContent.title}
                onChangeText={(text) =>
                  setNewPostContent({ ...newPostContent, title: text })
                }
              />
              <TextInput
                style={styles.largeInputField}
                placeholder="글의 내용"
                multiline
                value={newPostContent.content}
                onChangeText={(text) =>
                  setNewPostContent({ ...newPostContent, content: text })
                }
              />
              {/* 확인 버튼 */}
              <TouchableOpacity
                style={styles.modalPostButton}
                onPress={createPost}
              >
                <Text style={styles.editButtonText}>확인</Text>
              </TouchableOpacity>
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setPublishModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>닫기</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {/* Modify Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModifyModalVisible}
          onRequestClose={() => setModifyModalVisible(false)}
        >
          <View
            style={[
              styles.modalContainer,
              Platform.OS === "android"
                ? styles.androidShadow
                : styles.iosShadow,
            ]}
          >
            <View style={styles.modalContent}>
              <TextInput
                style={styles.inputField}
                placeholder="글의 제목"
                value={modifiedContent.title}
                onChangeText={(text) =>
                  setModifiedContent({ ...modifiedContent, title: text })
                }
              />
              <TextInput
                style={styles.inputField}
                placeholder="글의 내용"
                multiline
                value={modifiedContent.content}
                onChangeText={(text) =>
                  setModifiedContent({ ...modifiedContent, content: text })
                }
              />
              {/* 확인 버튼 */}
              <TouchableOpacity
                style={styles.modalPostButton}
                onPress={updatePost}
              >
                <Text style={styles.editButtonText}>수정</Text>
              </TouchableOpacity>
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setModifyModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>닫기</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {/* View Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isViewModalVisible}
          onRequestClose={() => setViewModalVisible(false)}
        >
          <View
            style={[
              styles.modalContainer,
              Platform.OS === "android"
                ? styles.androidShadow
                : styles.iosShadow,
            ]}
          >
            <View style={styles.modalContent}>
              <Text style={styles.largeText}>{thePost.title}</Text>
              <Text style={styles.commentContentText}>{thePost.content}</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.commentInputField}
                  placeholder="댓글을 입력하세요..."
                  onChangeText={(text) => setNewComment(text)}
                />
                <Pressable
                  style={styles.commentButton}
                  onPress={() => addComment(newComment)}
                >
                  <Text style={styles.editButtonText}>게시</Text>
                </Pressable>
              </View>
              <ScrollView style={{ height: 470 }}>
                {thePost.comments &&
                  thePost.comments.map((comment) => (
                    <ChatComponent
                      comment_id={comment.comment_id}
                      key={comment.comment_id}
                      userName={comment.user_name}
                      user_email={comment.user_email}
                      content={comment.content}
                      onDelete={() => deleteComment(comment)}
                    />
                  ))}
              </ScrollView>

              <Pressable
                style={styles.viewModalCloseButton}
                onPress={() => setViewModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>닫기</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default TabScreen3;
