// TabScreen1.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import TabScreen1_mapmode from "./TabScreen1_mapmode";

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
  horizontalBox: {
    paddingTop: 15,
    paddingLeft: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  contentText: {
    fontSize: 15,
    marginTop: 5,
    marginBottom: 3,
  },
  dateText: {
    fontSize: 20,
  },
  timeText: {
    fontSize: 20,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  largeText: {
    fontSize: 30,
    fontWeight: "normal",
  },
  placeChildButton: {
    backgroundColor: "#A5D699",
    marginTop: 10,
    marginBottom: 5,
    padding: 17,
    borderRadius: 15,
    alignItems: "center",
  },
  placeChildButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

const formatTime = (time) => {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  return `${hours < 10 ? "0" : ""}${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;
};

const formatDate = (dateString) => {
  const year = dateString.substring(0, 4);
  const monthDay = dateString.substring(4);
  const month = parseInt(monthDay.substring(0, 2), 10);
  const day = parseInt(monthDay.substring(2), 10);

  // JavaScript에서 월은 0부터 시작하므로 1을 더해줍니다.
  const formattedDate = new Date(`${year}-${month}-${day}`);
  const options = { weekday: "long" }; // 'long' 옵션을 통해 긴 형식의 요일을 가져옵니다.
  const dayOfWeek = new Intl.DateTimeFormat("ko-KR", options).format(
    formattedDate
  );

  return `${month}월 ${day}일 ${dayOfWeek}`;
};

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

const ContentBox = ({ content, onPlaceChildClick }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleContentBoxClick = () => {
    setIsClicked(!isClicked);
  };

  return (
    <TouchableOpacity onPress={handleContentBoxClick} activeOpacity={0.7}>
      <View style={styles.box}>
        <Text style={[styles.contentText, styles.dateText]}>{`${formatDate(
          content.date
        )}`}</Text>
        <Text style={styles.timeContainer}>
          <Text style={[styles.contentText, styles.timeText, styles.largeText]}>
            {`${formatTime(content.start_time)}`}
          </Text>
          <Text style={[styles.contentText, styles.timeText]}>
            {" "}
            {`부터   `}
          </Text>
          <Text style={[styles.contentText, styles.timeText, styles.largeText]}>
            {`${formatTime(content.end_time)}`}
          </Text>
          <Text style={[styles.contentText, styles.timeText]}> 까지</Text>
        </Text>

        <Text style={styles.contentText}>{`${content.address}`}</Text>
        {isClicked && (
          <View>
            <View style={styles.horizontalBox}>
              <Text style={styles.contentText}>{`${
                new Date().getFullYear() - content.child_age
              }세, `}</Text>
              <Text style={styles.contentText}>{`${
                content.gender === "m" ? "남아" : "여아"
              }, `}</Text>
              <Text
                style={styles.contentText}
              >{`평점: ${content.rating}/5`}</Text>
            </View>

            <TouchableOpacity
              onPress={onPlaceChildClick}
              activeOpacity={0.7}
              style={styles.placeChildButton}
            >
              <Text style={styles.placeChildButtonText}>맡기기</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const TabScreen1 = ({ navigation }) => {
  const [mapModeVisible, setMapModeVisible] = useState(false);
  const [data, setData] = useState([]);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [defaultStartTime, setdefaultStartTime] = useState(new Date());
  const [defaultEndTime, setDefaultEndTime] = useState(new Date());

  const handleTogglePress = () => {
    setMapModeVisible(!mapModeVisible);
  };

  const handlePlaceChildClick = async (contentId) => {
    try {
      const response = await fetch(
        `http://pumasi.everdu.com/care/${contentId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "reserved" }),
        }
      );

      if (response.ok) {
        setData((prevData) =>
          prevData.map((content) =>
            content.id === contentId
              ? { ...content, status: "reserved" }
              : content
          )
        );
        alert("예약되었습니다");
      } else {
        console.error("Server error:", response.status);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
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

  useEffect(() => {
    setSelectedStartTime(1300);
    setSelectedEndTime(1400);
    defaultStartTime.setHours(13, 0, 0, 0);
    defaultEndTime.setHours(14, 0, 0, 0);
  }, []);

  const onChangeStart = (event, selectedDate) => {
    if (selectedDate) {
      setdefaultStartTime(selectedDate);
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const timeIn4Digits = hours * 100 + minutes;
      setSelectedStartTime(timeIn4Digits);
      console.log(`시작: ${timeIn4Digits}`); // 선택된 시간을 4자리 숫자로 변환한 값 출력
    }
  };

  const onChangeEnd = (event, selectedDate) => {
    if (selectedDate) {
      setDefaultEndTime(selectedDate);
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const timeIn4Digits = hours * 100 + minutes;
      setSelectedEndTime(timeIn4Digits);
      console.log(`끝: ${timeIn4Digits}`); // 선택된 시간을 4자리 숫자로 변환한 값 출력
    }
  };

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
          <View style={styles.horizontalBox}>
            <DateTimePicker
              value={defaultStartTime}
              mode={"time"}
              is24Hour={true}
              onChange={onChangeStart}
            />
            <Text>{`  부터`}</Text>
            <DateTimePicker
              value={defaultEndTime}
              mode={"time"}
              is24Hour={true}
              onChange={onChangeEnd}
            />
            <Text>{`  까지`}</Text>
          </View>

          {data
            .filter(
              (content) =>
                content.status !== "reserved" &&
                selectedStartTime >= content.start_time &&
                selectedEndTime <= content.end_time
            )
            .map((content, index) => (
              <ContentBox
                key={index}
                content={content}
                onPlaceChildClick={() => handlePlaceChildClick(content.id)}
              />
            ))}
        </ScrollView>
      )}
    </View>
  );
};

export default TabScreen1;
