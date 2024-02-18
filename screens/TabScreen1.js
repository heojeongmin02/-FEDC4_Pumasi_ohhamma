// TabScreen1.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Platform,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { idToken, userId } from "./LoginScreen";
import MapView, { Marker } from "react-native-maps";
import Geocoder from "react-native-geocoding";
import * as Location from "expo-location";

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
    flexDirection: "row",
    alignItems: "center",
  },
  timePicker: {
    paddingTop: 10,
    paddingLeft: 5,
    paddingBottom: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  androidShadow: {
    elevation: 5,
  },
  iosShadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  modalContent: {
    width: "95%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },
  confirmButton: {
    backgroundColor: "#A5D699",
    marginTop: 10,
    padding: 15,
    borderRadius: 15,
    height: 50,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 15,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#D5D5D5",
    fontSize: 16,
    fontWeight: "bold",
  },
  mediumText: {
    marginTop: 30,
    fontSize: 25,
    marginBottom: 10,
  },
  childSelectButton: {
    width: "48%",
    padding: 15,
    marginBottom: 10,
    borderRadius: 15,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
  },
  childSelectButton_activated: {
    width: "48%",
    backgroundColor: "#A5D699",
    marginBottom: 10,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  childSelectButtonText: {
    fontSize: 16,
  },
  childSelectButtonText_activated: {
    color: "white",
    fontSize: 16,
  },
  map: {
    flex: 1,
  },
});

// 시간을 4자리 숫자로 받아서 00:00 형식으로 변환하는 함수
const formatTime = (time) => {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  return `${hours < 10 ? "0" : ""}${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;
};

// 날짜를 2021년 1월 1일 금요일 형식으로 변환하는 함수
const formatDate = (dateString) => {
  const year = dateString.substring(0, 4);
  const monthDay = dateString.substring(4);
  const month = parseInt(monthDay.substring(0, 2), 10);
  const day = parseInt(monthDay.substring(2), 10);

  const formattedDate = new Date(`${year}-${month}-${day}`);
  const options = { weekday: "long" }; // 'long' 옵션을 통해 긴 형식의 요일을 가져옵니다.
  const dayOfWeek = new Intl.DateTimeFormat("ko-KR", options).format(
    formattedDate
  );

  return `${month}월 ${day}일 ${dayOfWeek}`;
};

// TabHeader 컴포넌트
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

// ChildContentBox 컴포넌트
const ChildContentBox = ({ content, selectedChildId, setSelectedChildId }) => {
  const isActivated = selectedChildId === content.child_id;

  return (
    <TouchableOpacity
      style={
        isActivated
          ? styles.childSelectButton_activated
          : styles.childSelectButton
      }
      onPress={() => setSelectedChildId(content.child_id)}
    >
      <Text
        style={
          isActivated
            ? styles.childSelectButtonText_activated
            : styles.childSelectButtonText
        }
      >{`${content.name}`}</Text>
    </TouchableOpacity>
  );
};

// ContentBox 컴포넌트
const ContentBox = ({ content, fetchData, navigation }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [childData, setChildData] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);

  // ContentBox를 클릭했을 때 실행되는 함수
  const handleContentBoxClick = () => {
    setIsClicked(!isClicked);
  };

  // 맡기기 버튼을 클릭했을 때 실행되는 함수
  const handlePlaceChildButton = () => {
    setModalVisible(true);
  };

  // 맡기기 확인 버튼을 클릭했을 때 실행되는 함수
  const handleConfirmButton = () => {
    setModalVisible(false);
    fetch(`http://pumasi.everdu.com/care/${content.email}/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${idToken}`,
      },
      body: JSON.stringify({
        child_id: selectedChildId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Success");
          alert("예약되었습니다. 채팅을 시작해보세요!");
          navigation.navigate("ChatList", { inviteUserEmail: content.email });
          fetchData();
        } else {
          console.error("Error:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // 아이 정보를 가져오는 함수
  const fetchChildData = async () => {
    try {
      const response = await fetch(
        `http://pumasi.everdu.com/user/${userId}/child`,
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
        setChildData(result);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // fetchChildData를 최초에 실행하는 useEffect
  useEffect(() => {
    fetchChildData();
  }, []);

  return (
    <>
      <TouchableOpacity onPress={handleContentBoxClick} activeOpacity={0.7}>
        <View style={styles.box}>
          <Text style={[styles.contentText, styles.dateText]}>{`${formatDate(
            content.date
          )}`}</Text>
          <Text style={styles.timeContainer}>
            <Text
              style={[styles.contentText, styles.timeText, styles.largeText]}
            >
              {`${formatTime(content.start_time)}`}
            </Text>
            <Text style={[styles.contentText, styles.timeText]}>
              {" "}
              {`부터   `}
            </Text>
            <Text
              style={[styles.contentText, styles.timeText, styles.largeText]}
            >
              {`${formatTime(content.end_time)}`}
            </Text>
            <Text style={[styles.contentText, styles.timeText]}> 까지</Text>
          </Text>

          <Text style={styles.contentText}>{`${content.address}`}</Text>
          {isClicked && (
            <View>
              <View style={styles.horizontalBox}>
                <Text style={styles.contentText}>{`${
                  new Date().getFullYear() - content.child_age_from
                }세 부터 ${
                  new Date().getFullYear() - content.child_age_to
                }세 대상,  `}</Text>
                <Text style={styles.contentText}>{`${
                  content.gender === "m" ? "남아" : "여아"
                },  `}</Text>
                <Text
                  style={styles.contentText}
                >{`평점: ${content.rating}/5`}</Text>
              </View>

              <TouchableOpacity
                onPress={handlePlaceChildButton}
                activeOpacity={0.7}
                style={styles.placeChildButton}
              >
                <Text style={styles.placeChildButtonText}>맡기기</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={[
            styles.modalContainer,
            Platform.OS === "android" ? styles.androidShadow : styles.iosShadow,
          ]}
        >
          <View style={styles.modalContent}>
            <Text style={[styles.contentText, styles.dateText]}>{`${formatDate(
              content.date
            )}`}</Text>
            <Text style={styles.timeContainer}>
              <Text
                style={[styles.contentText, styles.timeText, styles.largeText]}
              >
                {`${formatTime(content.start_time)}`}
              </Text>
              <Text style={[styles.contentText, styles.timeText]}>
                {" "}
                {`부터   `}
              </Text>
              <Text
                style={[styles.contentText, styles.timeText, styles.largeText]}
              >
                {`${formatTime(content.end_time)}`}
              </Text>
              <Text style={[styles.contentText, styles.timeText]}> 까지</Text>
            </Text>

            <Text style={styles.contentText}>{`${content.address}`}</Text>
            <Text style={styles.mediumText}>맡길 아이를 선택해주세요</Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {childData.map((content) => (
                <ChildContentBox
                  key={content.child_id}
                  content={content}
                  selectedChildId={selectedChildId}
                  setSelectedChildId={setSelectedChildId}
                />
              ))}
            </View>
            {/* 확인 버튼 */}
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmButton}
            >
              <Text style={styles.confirmButtonText}>맡기기</Text>
            </TouchableOpacity>
            {/* 팝업 닫기 버튼 */}
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.closeButtonText}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const TabScreen1 = (navigation) => {
  const [mapModeVisible, setMapModeVisible] = useState(false);
  const [data, setData] = useState([]);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [defaultStartTime, setdefaultStartTime] = useState(new Date());
  const [defaultEndTime, setDefaultEndTime] = useState(new Date());

  const GOOGLE_MAPS_API_KEY = "AIzaSyAFAKESEokQqhqHi9hNx-ZUn-9fabPWNj4";
  Geocoder.init(GOOGLE_MAPS_API_KEY);

  // 지도/목록 전환 버튼을 눌렀을 때 실행되는 함수
  const handleTogglePress = () => {
    setMapModeVisible(!mapModeVisible);
  };

  // 데이터를 불러오는 함수
  const fetchData = async () => {
    try {
      const response = await fetch("http://pumasi.everdu.com/care/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${idToken}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
        console.log(result);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 맡기기 데이터를 불러오는 useEffect
  useEffect(() => {
    fetchData();
  }, []);

  // 시간을 초기화하는 useEffect
  useEffect(() => {
    setSelectedStartTime(1300);
    setSelectedEndTime(1400);
    defaultStartTime.setHours(13, 0, 0, 0);
    defaultEndTime.setHours(14, 0, 0, 0);
  }, []);

  // 시작 시간을 변경했을 때 실행되는 함수
  const onChangeStart = (event, selectedDate) => {
    if (selectedDate) {
      setdefaultStartTime(selectedDate);
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const timeIn4Digits = hours * 100 + minutes;
      setSelectedStartTime(timeIn4Digits);
    }
  };

  // 종료 시간을 변경했을 때 실행되는 함수
  const onChangeEnd = (event, selectedDate) => {
    if (selectedDate) {
      setDefaultEndTime(selectedDate);
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const timeIn4Digits = hours * 100 + minutes;
      setSelectedEndTime(timeIn4Digits);
    }
  };

  // MapView 컴포넌트
  const MapContent = ({ data }) => {
    const [region, setRegion] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [childData, setChildData] = useState([]);
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState({
      address: "서울특별시",
      child_age_from: 2020,
      child_age_to: 2013,
      date: "20240206",
      email: "test2@example.com",
      end_time: 1400,
      gender: "f",
      id: "test@example.com",
      location: { latitude: 37.4919338, longitude: 127.0565469 },
      rating: 4.0,
      start_time: 1300,
      status: "waiting",
      user_name: "test",
    });

    // 지도 스타일
    const customMapStyle = [
      {
        featureType: "poi",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
    ];

    // 현재 위치를 가져오는 useEffect
    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Lowest,
        });

        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });

        const geocodedMarkers = await Promise.all(
          data.map(async (content) => {
            let geocode;

            try {
              geocode = await Geocoder.from(content.address);
            } catch (error) {
              console.error("Geocoding error:", error);
              geocode = [];
            }
            return {
              ...content,
              location: {
                latitude: geocode.results[0].geometry.location.lat,
                longitude: geocode.results[0].geometry.location.lng,
              },
            };
          })
        );
        // 지오코딩된 좌표로 마커 설정
        setMarkers(geocodedMarkers);
      })();
    }, []);

    // 아이 정보를 가져오는 함수
    const fetchChildData = async () => {
      try {
        const response = await fetch(
          `http://pumasi.everdu.com/user/${userId}/child`,
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
          setChildData(result);
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // fetchChildData를 최초에 실행하는 useEffect
    useEffect(() => {
      fetchChildData();
    }, []);

    // 특정 마커를 클릭했을 때 실행되는 함수
    const handleMarkerPress = (content) => {
      setSelectedMarker(content);
      setModalVisible(true);
    };

    // 맡기기 확인 버튼을 클릭했을 때 실행되는 함수
    const handleConfirmButton = (content) => {
      setModalVisible(false);
      fetch(`http://pumasi.everdu.com/care/${content.email}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${idToken}`,
        },
        body: JSON.stringify({
          child_id: selectedChildId,
        }),
      })
        .then((response) => {
          if (response.ok) {
            console.log("Success");
            fetchData();
          } else {
            console.error("Error:", response.statusText);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    return (
      <View style={styles.container}>
        {region && (
          <MapView
            style={styles.map}
            region={region}
            provider="google"
            customMapStyle={customMapStyle}
            showsUserLocation={true}
          >
            {markers.map((content) => (
              <Marker
                key={content.email}
                coordinate={{
                  latitude: content.location?.latitude || 0,
                  longitude: content.location?.longitude || 0,
                }}
                title={content.address}
                description={`평점: ${content.rating}`}
                onPress={() => handleMarkerPress(content)}
              />
            ))}
          </MapView>
        )}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
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
              <Text
                style={[styles.contentText, styles.dateText]}
              >{`${formatDate(selectedMarker.date)}`}</Text>
              <Text style={styles.timeContainer}>
                <Text
                  style={[
                    styles.contentText,
                    styles.timeText,
                    styles.largeText,
                  ]}
                >
                  {`${formatTime(selectedMarker.start_time)}`}
                </Text>
                <Text style={[styles.contentText, styles.timeText]}>
                  {" "}
                  {`부터   `}
                </Text>
                <Text
                  style={[
                    styles.contentText,
                    styles.timeText,
                    styles.largeText,
                  ]}
                >
                  {`${formatTime(selectedMarker.end_time)}`}
                </Text>
                <Text style={[styles.contentText, styles.timeText]}> 까지</Text>
              </Text>

              <Text
                style={styles.contentText}
              >{`${selectedMarker.address}`}</Text>
              <Text style={styles.mediumText}>맡길 아이를 선택해주세요</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {childData.map((selectedMarker) => (
                  <ChildContentBox
                    key={selectedMarker.child_id}
                    content={selectedMarker}
                    selectedChildId={selectedChildId}
                    setSelectedChildId={setSelectedChildId}
                  />
                ))}
              </View>
              {/* 확인 버튼 */}
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => handleConfirmButton(selectedMarker)}
              >
                <Text style={styles.confirmButtonText}>맡기기</Text>
              </TouchableOpacity>
              {/* 팝업 닫기 버튼 */}
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.closeButtonText}>닫기</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TabHeader
        name="맡기기"
        onTogglePress={handleTogglePress}
        mapModeVisible={mapModeVisible}
      />
      <View style={styles.timePicker}>
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

      {mapModeVisible ? (
        <MapContent
          data={data.filter(
            (content) =>
              content.email !== userId &&
              content.status !== "reserved" &&
              selectedStartTime >= content.start_time &&
              selectedEndTime <= content.end_time
          )}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {data
            .filter(
              (content) =>
                content.email !== userId &&
                content.status !== "reserved" &&
                selectedStartTime >= content.start_time &&
                selectedEndTime <= content.end_time
            )
            .map((content, index) => (
              <ContentBox
                key={index}
                content={content}
                fetchData={fetchData}
                navigation={navigation}
              />
            ))}
        </ScrollView>
      )}
    </View>
  );
};

export default TabScreen1;
