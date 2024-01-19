// TabScreen4.js

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

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

  React.useEffect(() => {
    // mock data... 나중에 서버랑 연결할거임
    const fetchedChatRooms = [
      { id: 1, name: "서준맘" },
      { id: 2, name: "세은대디" },
    ];
    setChatRooms(fetchedChatRooms);
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

  React.useEffect(() => {
    // mock data...
    const roomId = navigation.getParam("roomId", 0);
    let fetchedMessages = [];

    if (roomId === 1) {
      // 서준맘과의 채팅
      fetchedMessages = [
        {
          _id: 1,
          text: "안녕하세요!",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "서준맘",
          },
        },
      ];
    } else if (roomId === 2) {
      // 세은대디와의 채팅
      fetchedMessages = [
        {
          _id: 1,
          text: "좀이따 뵙겠습니다.",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "세은대디",
          },
        },
      ];
    }
    setMessages(fetchedMessages);
  }, []);

  const onSend = (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
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
                color: "#ffffff", // 오른쪽(나의 메시지) 텍스트 색상
              },
              left: {
                color: "#616161", // 왼쪽(상대방의 메시지) 텍스트 색상
              },
            }}
            wrapperStyle={{
              left: {
                backgroundColor: "#A5D699", // 왼쪽(상대방의 메시지) 배경색
              },
              right: {
                backgroundColor: "#D9D9D9", // 오른쪽(나의 메시지) 배경색
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
      navigationOptions: {
        headerShown: false,
      },
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
