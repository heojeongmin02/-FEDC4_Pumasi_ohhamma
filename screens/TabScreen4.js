// TabScreen4.js

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { idToken, userId } from "./LoginScreen";
import { inviteUserEmail } from "./TabScreen1";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabHeader: {
    height: 110,
    justifyContent: "center",
    alignItems: "left",
    backgroundColor: "#f0f0f0",
  },
  tabHeaderText: {
    marginTop: 50,
    marginLeft: 30,
    fontSize: 24,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
  },
  chatItemText: {
    fontSize: 24,
    color: "#9a9a9a",
  },
});

const TabHeader = ({ name }) => (
  <View style={styles.tabHeader}>
    <Text style={styles.tabHeaderText}>{name}</Text>
  </View>
);

const ChatListScreen = ({ navigation }) => {
  const [chatRooms, setChatRooms] = useState([]);

  console.log(inviteUserEmail);

  const createChatRoom = async (inviteUserEmail) => {
    try {
      const response = await fetch("http://pumasi.everdu.com/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${idToken}`,
        },
        body: JSON.stringify({ invite_user: inviteUserEmail }),
      });

      if (response.status === 201) {
        const responseData = await response.json();
        const roomId = responseData.room_id;
        const roomName = responseData.invited_user_name;
        return { roomId, roomName };
      } else {
        console.error("채팅방 생성 실패:", response.status);
      }
    } catch (error) {
      console.error("채팅방 생성 중 오류:", error.message);
    }
  };

  const findChatRoom = (chatRooms, inviteUserEmail) => {
    for (const chatRoom of chatRooms) {
      if (chatRoom.members.includes(inviteUserEmail)) {
        return {
          roomId: chatRoom.room_id,
          roomName: chatRoom.members.join(", "),
        };
      }
    }
    return null;
  };

  const fetchChatRooms = async () => {
    try {
      const response = await fetch("http://pumasi.everdu.com/chat/list", {
        method: "GET",
        headers: {
          Authorization: `${idToken}`,
        },
      });

      if (response.ok) {
        const fetchedChatRooms = await response.json();
        setChatRooms(fetchedChatRooms);
        return fetchedChatRooms;
      } else {
        throw new Error("채팅방 불러오기 실패");
      }
    } catch (error) {
      console.error("채팅방 불러오기 중 오류:", error.message);
    }
  };

  useEffect(() => {
    const fetchAndCreateChatRoom = async () => {
      const fetchedChatRooms = await fetchChatRooms();
      const existingChatRoom = findChatRoom(fetchedChatRooms, inviteUserEmail);
      if (inviteUserEmail && !existingChatRoom) {
        const { roomId, roomName } = await createChatRoom(inviteUserEmail);
        console.log(`생성된 채팅방 ID: ${roomId}, 이름: ${roomName}`);
      }
    };

    fetchAndCreateChatRoom();
  }, [inviteUserEmail]);

  const navigateToChatRoom = (roomId, roomName) => {
    navigation.navigate("ChatRoom", { roomId, roomName });
  };

  const deleteChatRoom = async (roomId) => {
    try {
      const response = await fetch(`http://pumasi.everdu.com/chat/${roomId}`, {
        method: "DELETE",
        headers: {
          Authorization: `${idToken}`,
        },
      });

      if (response.ok) {
        fetchChatRooms();
      } else {
        throw new Error("채팅방 삭제 실패");
      }
    } catch (error) {
      console.error("채팅방 삭제 중 오류:", error.message);
    }
  };

  const confirmDeleteChatRoom = (roomId) => {
    Alert.alert("채팅방 나가기", "", [
      {
        text: "취소",
        style: "cancel",
      },
      { text: "나가기", onPress: () => deleteChatRoom(roomId) },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: "white" }]}>
      <FlatList
        data={chatRooms}
        keyExtractor={(item) => item.room_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() =>
              navigateToChatRoom(item.room_id, item.members.join(", "))
            }
            onLongPress={() => confirmDeleteChatRoom(item.room_id)}
          >
            <Text style={styles.chatItemText}>{item.members.join(", ")}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const ChatRoomScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const roomId = navigation.getParam("roomId", 0);
  const roomName = navigation.getParam("roomName", "채팅방");

  const onSend = async (newMessages = []) => {
    try {
      const response = await fetch(
        `http://pumasi.everdu.com/chat/${roomId}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${idToken}`,
          },
          body: JSON.stringify({ message: newMessages[0].text }),
        }
      );

      setMessages((prevMessages) =>
        GiftedChat.append(prevMessages, newMessages)
      );
    } catch (error) {
      console.error("메시지 전송 중 오류:", error.message);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://pumasi.everdu.com/chat/${roomId}`, {
        method: "GET",
        headers: {
          Authorization: `${idToken}`,
        },
      });

      if (response.ok) {
        const fetchedMessages = await response.json();

        const formattedMessages = fetchedMessages.map((message, index) => {
          let dateStr = message.send_time;
          let formattedDateStr = dateStr.replace(", ", "T").replace(/\//g, "-");
          let date = new Date(formattedDateStr);

          return {
            _id: index,
            text: message.message,
            createdAt: date,
            user: {
              _id: message.sender,
              name: message.sender,
            },
          };
        });

        formattedMessages.sort((a, b) => b.createdAt - a.createdAt);

        setMessages(formattedMessages);
      } else {
        throw new Error("메시지 불러오기 실패");
      }
    } catch (error) {
      console.error("메시지 불러오기 중 오류:", error.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [roomId, idToken]);

  useEffect(() => {
    const timerID = setInterval(() => {
      fetchMessages();
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, [roomId, idToken]);

  return (
    <View style={styles.contentContainer}>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: userId,
        }}
        renderBubble={(props) => (
          <Bubble
            {...props}
            textStyle={{
              right: {
                color: "#ffffff", // 내 텍스트색
              },
              left: {
                color: "#616161", // 상대 텍스트색
              },
            }}
            wrapperStyle={{
              left: {
                backgroundColor: "#A5D699", // 상대 배경색
              },
              right: {
                backgroundColor: "#D9D9D9", // 내 배경색
              },
            }}
          />
        )}
      />
    </View>
  );
};

const AppNavigator = createStackNavigator(
  {
    ChatList: {
      screen: ChatListScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    ChatRoom: {
      screen: ChatRoomScreen,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam("roomName", "채팅방"),
      }),
    },
  },
  {
    initialRouteName: "ChatList",
  }
);

const AppContainer = createAppContainer(AppNavigator);

const App = () => (
  <View style={styles.container}>
    <TabHeader name="채팅" />
    <AppContainer />
  </View>
);

export default App;
