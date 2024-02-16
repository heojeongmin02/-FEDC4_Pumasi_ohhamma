// TabScreen4.js

import React, { useEffect, useState } from "react";
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

const ChatListScreen = ({ route, navigation }) => {
  const inviteUserEmail = route?.params?.inviteUserEmail;
  //const inviteUserEmail = route.params.inviteUserEmail;
  const [chatRooms, setChatRooms] = useState([]);

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
        const roomName = responseData.roomName;
        // responseData.roomName의 roomName 서버에서 지정한 이름으로 바꿀 것 !!!!
        return roomId, roomName;
      } else {
        console.error("채팅방 생성 실패:", response.status);
      }
    } catch (error) {
      console.error("채팅방 생성 중 오류:", error.message);
    }
  };

  useEffect(() => {
    const fetchAndCreateChatRoom = async () => {
      if (inviteUserEmail) {
        await createChatRoom(inviteUserEmail);
      }
      await fetchChatRooms();
    };

    fetchAndCreateChatRoom();
  }, [inviteUserEmail]);

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
      } else {
        throw new Error("채팅방 불러오기 실패");
      }
    } catch (error) {
      console.error("채팅방 불러오기 중 오류:", error.message);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const navigateToChatRoom = (roomId, roomName) => {
    navigation.navigate("ChatRoom", { roomId, roomName });
  };

  return (
    <View style={[styles.container, { backgroundColor: "white" }]}>
      <FlatList
        data={chatRooms}
        // keyExtractor={(item) => item.id.toString()}
        keyExtractor={(item, index) => item.id || index.toString()}
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
  const [messages, setMessages] = useState([]);
  const roomId = navigation.getParam("roomId", 0);
  const roomName = navigation.getParam("roomName", "채팅방");

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
        setMessages(fetchedMessages);
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

  // const fetchMessagesPeriodically = async () => {
  //   await fetchMessages();

  //   const intervalId = setInterval(async () => {
  //     await fetchMessages();
  //   }, 10000); // 10초

  //   // clearInterval 호출하여 중단
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // };

  // useEffect(() => {
  //   fetchMessagesPeriodically();
  // }, [roomId, idToken]);

  const onSend = async (newMessages = []) => {
    try {
      await fetch(`http://pumasi.everdu.com/chat/${roomId}/message/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${idToken}`,
        },
        body: JSON.stringify({ message: newMessages[0].text }),
      });

      setMessages((prevMessages) =>
        GiftedChat.append(prevMessages, newMessages)
      );
    } catch (error) {
      console.error("메시지 전송 중 오류:", error.message);
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
