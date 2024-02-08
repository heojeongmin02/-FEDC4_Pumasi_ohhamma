// TabScreen3.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Button,
  Pressable,
} from "react-native";
import { idToken } from "./LoginScreen";

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
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
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

const ContentBox = ({ post }) => {
  return (
    <View style={styles.box}>
      <Text style={styles.largeText}>{post.title}</Text>
      <Text style={styles.contentText}>{post.content}</Text>
    </View>
  );
};

const TabScreen3 = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState({
    title: "",
    content: "",
  });
  const [isPublishModalVisible, setPublishModalVisible] = useState(false);

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
  const fetchPostById = async (postId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/post/${postId}`);
      const data = await response.json();
      console.log("Fetched post:", data);
    } catch (error) {
      console.error(`Error fetching post ${postId}:`, error);
    }
  };

  // 3. 특정 글을 삭제하는 함수
  const deletePost = async (postId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/post/${postId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log(`Post ${postId} deleted successfully`);
        fetchPosts(); // Refresh the post list after deletion
      } else {
        console.error(`Error deleting post ${postId}`);
      }
    } catch (error) {
      console.error(`Error deleting post ${postId}:`, error);
    }
  };

  // 4. 특정 글을 수정하는 함수
  const updatePost = async (postId, newContent) => {
    try {
      const response = await fetch(`${API_BASE_URL}/post/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newContent }),
      });
      if (response.ok) {
        console.log(`Post ${postId} updated successfully`);
        fetchPosts(); // Refresh the post list after update
      } else {
        console.error(`Error updating post ${postId}`);
      }
    } catch (error) {
      console.error(`Error updating post ${postId}:`, error);
    }
  };

  // 5. 새로운 글을 생성하는 함수
  const createPost = async () => {
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
        console.error("Error creating post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const onPressPublish = () => {
    setPublishModalVisible(true);
  };

  useEffect(() => {
    // Fetch posts when the component mounts
    fetchPosts();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <TabHeader name="커뮤니티" onPressPublish={onPressPublish} />
      <View style={styles.contentContainer}>
        {/* Posts rendering */}
        {posts.map((post, index) => (
          <ContentBox key={index} post={post} />
        ))}

        {/* Publish Modal */}
        <Modal
          animationType="slide"
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
                style={styles.inputField}
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
      </View>
    </View>
  );
};

export default TabScreen3;
