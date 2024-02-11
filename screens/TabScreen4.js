// TabScreen4.js

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { idToken } from "./LoginScreen";

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
  },
});

const TabHeader = ({ name }) => (
  <View style={styles.tabHeader}>
    <Text style={styles.tabHeaderText}>{name}</Text>
  </View>
);

const ChatListScreen = ({ navigation }) => {
  const [chatRooms, setChatRooms] = React.useState([]);

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
      } else {
        console.error("Failed to create chat room:", response.status);
      }
    } catch (error) {
      console.error("Error creating chat room:", error.message);
    }
  };

  const fetchChatRooms = async () => {
    try {
      const response = await fetch("http://pumasi.everdu.com/chat/list", {
        method: "GET",
        headers: {
          // 인증 헤더
        },
      });

      if (!response.ok) {
        throw new Error("채팅방을 불러오는 데 실패했습니다");
      }

      const fetchedChatRooms = await response.json();
      setChatRooms(fetchedChatRooms);
    } catch (error) {
      console.error("채팅방을 불러오는 중 오류 발생:", error.message);
    }
  };

  React.useEffect(() => {
    fetchChatRooms();
  }, []);

  const navigateToChatRoom = (roomId, roomName) => {
    navigation.navigate("ChatRoom", { roomId, roomName });
  };

  return (
    <View style={[styles.container, { backgroundColor: "white" }]}>
      <FlatList
        data={chatRooms}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigateToChatRoom(item.id, item.name)}
          >
            <Text style={styles.chatItemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const ChatRoomScreen = ({ navigation }) => {
  const [messages, setMessages] = React.useState([]);
  const roomId = navigation.getParam("roomId", 0);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://pumasi.everdu.com/chat/${roomId}`, {
        method: "GET",
        headers: {
          // 인증 헤더
        },
      });

      if (!response.ok) {
        throw new Error("메시지를 불러오는 데 실패했습니다");
      }

      const fetchedMessages = await response.json();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("메시지를 불러오는 중 오류 발생:", error.message);
    }
  };

  React.useEffect(() => {
    fetchMessages();
  }, []);

  const onSend = async (newMessages = []) => {
    try {
      await fetch(`http://pumasi.everdu.com/chat/${roomId}/message`, {
        method: "POST",
        headers: {
          // 인증 헤더
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessages[0].text }),
      });

      setMessages((prevMessages) =>
        GiftedChat.append(prevMessages, newMessages)
      );
    } catch (error) {
      console.error("메시지를 전송하는 중 오류 발생:", error.message);
    }
  };

  return (
    <View style={styles.contentContainer}>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: 1,
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
