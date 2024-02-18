// TabScreen1_mapmode.js

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geocoder from "react-native-geocoding";
import * as Location from "expo-location";
import { idToken, userId } from "./LoginScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  map: {
    flex: 1,
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
  contentText: {
    fontSize: 16,
    marginBottom: 10,
  },
  dateText: {
    fontWeight: "bold",
  },
  timeContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  timeText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 20,
  },
  mediumText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
});

const TabScreen1_mapmode = ({ data }) => {
  const [region, setRegion] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [childData, setChildData] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);

  const GOOGLE_MAPS_API_KEY = "AIzaSyAFAKESEokQqhqHi9hNx-ZUn-9fabPWNj4";
  Geocoder.init(GOOGLE_MAPS_API_KEY);

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
  };

  // 맵 설정
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

  // ChildContentBox 컴포넌트
  const ChildContentBox = ({
    content,
    selectedChildId,
    setSelectedChildId,
  }) => {
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
          console.log(content);
        } else {
          console.error("Error:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleMarkerPress = (content) => {
    console.log(content);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={styles.map}
          region={region}
          provider="google"
          customMapStyle={[]}
          showsUserLocation={true}
        >
          {markers.map((content, index) => (
            <>
              <Marker
                key={index}
                coordinate={{
                  latitude: content.location?.latitude || 0,
                  longitude: content.location?.longitude || 0,
                }}
                title={content.address}
                description={`평점: ${content.rating}, ${formatTime(
                  content.start_time
                )} ~ ${formatTime(content.end_time)}`}
                onPress={() => {
                  handleMarkerPress(content);
                }}
              />
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
                    >{`${formatDate(content.date)}`}</Text>
                    <Text style={styles.timeContainer}>
                      <Text
                        style={[
                          styles.contentText,
                          styles.timeText,
                          styles.largeText,
                        ]}
                      >
                        {`${formatTime(content.start_time)}`}
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
                        {`${formatTime(content.end_time)}`}
                      </Text>
                      <Text style={[styles.contentText, styles.timeText]}>
                        {" "}
                        까지
                      </Text>
                    </Text>

                    <Text
                      style={styles.contentText}
                    >{`${content.address}`}</Text>
                    <Text style={styles.mediumText}>
                      맡길 아이를 선택해주세요
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
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
          ))}
        </MapView>
      )}
    </View>
  );
};

export default TabScreen1_mapmode;
