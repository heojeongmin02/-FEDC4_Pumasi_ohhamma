// TabScreen1.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import TabScreen1_mapmode from "./TabScreen1_mapmode";

// "start_time": 1700,
// "date": "20240115",
// "child_age": 2013,
// "day": "mon",
// "rating": 3.8,
// "address": "서울시 마포구 와우산로 70 홍익대학교 T동 702",
// "gender": "f",
// "end_time": 2000,
// "email": "test@example.com",
// "status": "waiting",
// "id": "test@example.com"

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 10, // 스크롤 가능한 내용 아래 여백
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
  contentText: {
    fontSize: 16,
    marginBottom: 5,
  },
  contentText: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 20,
  },
  timeText: {
    fontSize: 20,
  },
});

const TabHeader = ({ name, onTogglePress, mapModeVisible }) => (
  <View style={styles.tabHeader}>
    <Text style={styles.tabHeaderText}>{name}</Text>
    <TouchableOpacity style={styles.toggleButton} onPress={onTogglePress}>
      <Text style={styles.toggleButtonText}>
        {mapModeVisible ? "목록" : "지도"}
      </Text>
    </TouchableOpacity>
  </View>
);

const ContentBox = ({ content }) => (
  <View style={styles.box}>
    <Text
      style={[styles.contentText, styles.dateText]}
    >{`Date: ${content.date}`}</Text>
    <Text
      style={[styles.contentText, styles.timeText]}
    >{`Start Time: ${content.start_time}`}</Text>
    <Text style={styles.contentText}>{`Child Age: ${
      new Date().getFullYear() - content.child_age
    }`}</Text>
    <Text style={styles.contentText}>{`Day: ${content.day}`}</Text>
    <Text style={styles.contentText}>{`Rating: ${content.rating}`}</Text>
    <Text style={styles.contentText}>{`Address: ${content.address}`}</Text>
    <Text style={styles.contentText}>{`End Time: ${content.end_time}`}</Text>
    <Text style={styles.contentText}>{`Email: ${content.email}`}</Text>
    <Text style={styles.contentText}>{`Status: ${content.status}`}</Text>
    <Text style={styles.contentText}>{`Gender: ${content.gender}`}</Text>
    <Text style={styles.contentText}>{`ID: ${content.id}`}</Text>
  </View>
);

const TabScreen1 = ({ navigation }) => {
  const [mapModeVisible, setMapModeVisible] = useState(false);
  const [data, setData] = useState([]);

  const handleTogglePress = () => {
    setMapModeVisible(!mapModeVisible);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://pumasi.everdu.com/care/list");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행

  return (
    <View style={styles.container}>
      <TabHeader
        name="맡기기"
        onTogglePress={handleTogglePress}
        mapModeVisible={mapModeVisible}
      />

      {mapModeVisible ? (
        <TabScreen1_mapmode />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {data.map((content, index) => (
            <ContentBox key={index} content={content} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default TabScreen1;
