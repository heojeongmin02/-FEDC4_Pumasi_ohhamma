// TabScreen2.js

import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { idToken, userId } from "./LoginScreen";
import { PostContext } from "./PostContext";

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
  dateTimePicker: {
    marginBottom: 10,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: "#A5D699",
    marginTop: 20,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-around",
  },
  toggleButton2: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginTop: 20,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-around",
  },
  placeBox: {
    backgroundColor: "#D9D9D9",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-around",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  textBox: {
    backgroundColor: "#ffffff",
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // 배경을 흐리게 표현하기 위한 rgba 값},
  },
  modalContent: {
    width: "95%", // 모달의 너비를 80%로 설정
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  darkgrayText: {
    fontSize: 18,
    color: "#616161",
  },
  middlegrayText: {
    fontSize: 18,
    color: "#9a9a9a",
  },
  whiteText: {
    fontSize: 18,
    color: "#ffffff",
  },
  largeText: {
    fontSize: 25,
    marginTop: 3,
    marginBottom: 6,
  },
  largeText2: {
    fontSize: 25,
    marginVertical: 10,
    marginHorizontal: 15,
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
  modalCloseButton: {
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#D5D5D5",
    fontSize: 16,
    fontWeight: "bold",
  },
  contentText: {
    fontSize: 15,
    marginTop: 5,
    marginBottom: 3,
  },
  contentContainer: {
    marginVertical: 10,
    marginHorizontal: 15,
  },
  subtitle: {
    fontSize: 18,
    //marginBottom: 10,
    color: "#616161",
  },
  map: {
    flex: 1,
    height: 230,
  },
});

const TabScreen2 = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [selectedPlace, setSelectedPlace] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [region, setRegion] = useState(null);
  const [selectedAgeRange, setSelectedAgeRange] = useState([1, 19]);
  const [selectedGender, setSelectedGender] = useState([]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [dateButtonSelected, setDateButtonSelected] = useState(false);
  const [startTimeButtonSelected, setStartTimeButtonSelected] = useState(false);
  const [endTimeButtonSelected, setEndTimeButtonSelected] = useState(false);
  const [isPlaceBoxSelected, setIsPlaceBoxSelected] = useState(false);
  const [isDetailedAddressEntered, setIsDetailedAddressEntered] =
    useState(false);

  const { isPostSubmitted, setIsPostSubmitted, responseData, setResponseData } =
    useContext(PostContext);
  //const [responseData, setResponseData] = useState(null);

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setDateButtonSelected(true);
    }
  };

  const handleStartTimeChange = (event, date) => {
    setShowStartTimePicker(false);
    if (date) {
      setSelectedStartTime(date);
      setStartTimeButtonSelected(true);
    }
  };

  const handleEndTimeChange = (event, date) => {
    setShowEndTimePicker(false);
    if (date) {
      setSelectedEndTime(date);
      setEndTimeButtonSelected(true);
    }
  };

  const handleMapPress = async (event) => {
    const { coordinate } = event.nativeEvent;
    setRegion({
      ...coordinate,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });

    try {
      const address = await Location.reverseGeocodeAsync({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });

      if (address.length > 0) {
        const { region, city, district, street, name } = address[0];
        let selectedAddress = "";

        if (region != null) {
          selectedAddress += `${region} `;
        }
        if (city != null) {
          selectedAddress += `${city} `;
        }
        if (district != null) {
          selectedAddress += `${district} `;
        }
        if (street != null) {
          selectedAddress += `${street} `;
        }
        if (name != null) {
          selectedAddress += `${name}`;
        }

        setSelectedPlace(selectedAddress.trim());
        setIsPlaceBoxSelected(true);
      }
    } catch (error) {
      console.error("주소를 가져오는 중 오류 발생:", error);
    }
  };

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
    })();
  }, []);

  const handleDetailedAddressChange = (text) => {
    setDetailedAddress(text);
    setIsDetailedAddressEntered(text.length > 0);
  };

  const handleGenderSelection = (gender) => {
    if (selectedGender.includes(gender)) {
      setSelectedGender(selectedGender.filter((item) => item !== gender));
    } else {
      setSelectedGender([...selectedGender, gender]);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };

  const formatTime = (time) => {
    const hours = String(time.getHours()).padStart(2, "0");
    const minutes = String(time.getMinutes()).padStart(2, "0");
    return `${hours}${minutes}`;
  };

  const formatAge = (age) => {
    const currentYear = new Date().getFullYear();
    return currentYear - age;
  };

  const formatGender = () => {
    if (selectedGender.length === 1) {
      if (selectedGender.includes("남자")) {
        return "m";
      } else if (selectedGender.includes("여자")) {
        return "f";
      }
    }
    return "both";
  };

  // 사용자 정보를 상태로 관리
  const [userInfo, setUserInfo] = useState({
    rating: "",
    address: "",
    email: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `http://pumasi.everdu.com/care/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${idToken}`,
            },
          }
        );

        if (response.ok) {
          const fetchedUserInfo = await response.json();
          setUserInfo(fetchedUserInfo);
        } else {
          console.error("서버 응답 오류1:", response.status);
        }
      } catch (error) {
        console.error("데이터 가져오는 중 오류:", error);
      }
    };

    fetchUserInfo();
  }, []); // userId가 변경될 때마다 사용자 정보를 다시 불러옴

  const handlePostData = async () => {
    const postData = {
      date: formatDate(selectedDate),
      start_time: formatTime(selectedStartTime),
      end_time: formatTime(selectedEndTime),
      child_age_from: formatAge(selectedAgeRange[0]),
      child_age_to: formatAge(selectedAgeRange[1]),
      rating: userInfo.rating,
      address: isPlaceBoxSelected
        ? selectedPlace + " " + detailedAddress
        : userInfo.address + " " + detailedAddress,
      email: userInfo.email,
      gender: formatGender(),
    };

    Alert.alert("게시하기", JSON.stringify(postData));
    // 나중엔 삭제할거임~~

    try {
      const response = await fetch("http://pumasi.everdu.com/care/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${idToken}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const responseData = await response.json();
        setResponseData(responseData);
        console.log("서버 응답:", responseData);
        Alert.alert("게시하기", "게시 성공!");
        setIsPostSubmitted(true);
      } else {
        console.error("서버 응답 오류2:", response.status);
        Alert.alert("게시하기", "게시 실패. 서버 응답 오류 발생!");
      }
    } catch (error) {
      console.error("데이터 게시 중 오류:", error);
      Alert.alert("게시하기", "게시 실패. 에러 발생!");
    }
  };

  const formatDateString = (dateString) => {
    const year = dateString.substring(0, 4);
    const monthDay = dateString.substring(4);
    const month = parseInt(monthDay.substring(0, 2), 10);
    const day = parseInt(monthDay.substring(2), 10);

    const formattedDate = new Date(`${year}-${month}-${day}`);
    const options = { weekday: "long" };
    const dayOfWeek = new Intl.DateTimeFormat("ko-KR", options).format(
      formattedDate
    );

    return `${year}년 ${month}월 ${day}일 ${dayOfWeek}`;
  };

  const formatDateString2 = (dateString) => {
    const year = dateString.substring(0, 4);
    const monthDay = dateString.substring(4);
    const month = parseInt(monthDay.substring(0, 2), 10);
    const day = parseInt(monthDay.substring(2), 10);

    const formattedDate = new Date(`${year}-${month}-${day}`);
    const options = { weekday: "long" };
    const dayOfWeek = new Intl.DateTimeFormat("ko-KR", options).format(
      formattedDate
    );

    return `${month}월 ${day}일 ${dayOfWeek}`;
  };

  const formatTimeString = (time) => {
    const hours = Math.floor(time / 100);
    const minutes = time % 100;
    return `${hours < 10 ? "0" : ""}${hours}시 ${
      minutes < 10 ? "0" : ""
    }${minutes}분`;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: "white" }]}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderText}>맡기</Text>
      </View>
      <View style={{ marginVertical: 5 }} />
      {isPostSubmitted && responseData ? (
        responseData.status === "reserved" ? (
          // 맡기 일정
          <ScrollView>
            <Text style={styles.largeText2}>예정된 맡기 일정</Text>
            <TouchableOpacity style={styles.box} onPress={handleOpenModal}>
              <Text style={styles.largeText}>
                {formatDateString2(responseData.date)}
              </Text>
              <Text style={styles.contentText}>
                {`${formatTimeString(
                  responseData.start_time
                )} 부터 ${formatTimeString(responseData.end_time)} 까지`}
              </Text>
              <Text style={styles.contentText}>
                {responseData.address}에서 맡기 일정이 있어요 {":)"}
              </Text>

              <Modal
                animationType="fade"
                transparent={true}
                visible={isModalOpen}
                onRequestClose={handleCloseModal}
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
                    <Text style={styles.largeText}>
                      {formatDateString2(responseData.date)}
                    </Text>
                    <Text style={styles.contentText}>
                      시간:{" "}
                      {`${formatTimeString(
                        responseData.start_time
                      )} 부터 ${formatTimeString(responseData.end_time)} 까지`}
                    </Text>
                    <Text style={styles.contentText}>
                      주소: {responseData.address}
                    </Text>
                    <Text style={styles.contentText}>
                      성별:{" "}
                      {responseData.gender === "m" && (
                        <Text style={styles.contentText}>남아</Text>
                      )}
                      {responseData.gender === "f" && (
                        <Text style={styles.contentText}>여아</Text>
                      )}
                      {responseData.gender === "both" && (
                        <Text style={styles.contentText}>남아, 여아</Text>
                      )}
                    </Text>
                    <Text style={styles.contentText}>
                      나이:{" "}
                      {`${
                        new Date().getFullYear() - responseData.child_age_from
                      }세 부터 ${
                        new Date().getFullYear() - responseData.child_age_to
                      }세 까지`}
                    </Text>
                    <TouchableOpacity
                      style={styles.modalCloseButton}
                      onPress={handleCloseModal}
                    >
                      <Text style={styles.closeButtonText}>닫기</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <ScrollView>
            <View style={styles.contentContainer}>
              <Text style={styles.subtitle}>맡을 날짜를 선택해주세요</Text>
              <View style={styles.toggleContainer}>
                <View style={styles.toggleButton2}>
                  <Text style={styles.middlegrayText}>
                    {formatDateString(responseData.date)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.subtitle}>맡을 시간을 선택해주세요</Text>

              <View style={styles.toggleContainer}>
                <View style={styles.toggleButton2}>
                  <Text style={styles.middlegrayText}>
                    {formatTimeString(responseData.start_time)}
                  </Text>
                </View>

                <View style={styles.textBox}>
                  <Text style={styles.middlegrayText}>부터</Text>
                </View>

                <View style={styles.toggleButton2}>
                  <Text style={styles.middlegrayText}>
                    {formatTimeString(responseData.end_time)}
                  </Text>
                </View>
                <View style={styles.textBox}>
                  <Text style={styles.middlegrayText}>까지</Text>
                </View>
              </View>
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.subtitle}>맡을 장소를 선택해주세요</Text>
              <View style={styles.toggleContainer}>
                <View style={styles.toggleButton2}>
                  <Text style={styles.middlegrayText}>
                    {responseData.address}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.subtitle}>맡을 성별을 선택해주세요</Text>
              <View style={styles.toggleContainer}>
                {responseData.gender === "m" && (
                  <View style={styles.toggleButton2}>
                    <Text style={styles.middlegrayText}>남자</Text>
                  </View>
                )}
                {responseData.gender === "f" && (
                  <View style={styles.toggleButton2}>
                    <Text style={styles.middlegrayText}>여자</Text>
                  </View>
                )}
                {responseData.gender === "both" && (
                  <>
                    <View style={styles.toggleButton2}>
                      <Text style={styles.middlegrayText}>남자</Text>
                    </View>
                    <View style={{ marginHorizontal: 10 }} />
                    <View style={styles.toggleButton2}>
                      <Text style={styles.middlegrayText}>여자</Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.subtitle}>맡을 나이를 선택해주세요</Text>

              <View style={styles.toggleContainer}>
                <View style={styles.toggleButton2}>
                  <Text style={styles.middlegrayText}>
                    {new Date().getFullYear() - responseData.child_age_from}세
                  </Text>
                </View>

                <View style={styles.textBox}>
                  <Text style={styles.middlegrayText}>부터</Text>
                </View>

                <View style={styles.toggleButton2}>
                  <Text style={styles.middlegrayText}>
                    {new Date().getFullYear() - responseData.child_age_to}세
                  </Text>
                </View>
                <View style={styles.textBox}>
                  <Text style={styles.middlegrayText}>까지</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: "#A5D699",
                padding: 15,
                borderRadius: 10,
                margin: 20,
                marginLeft: 40,
                marginRight: 40,
                alignItems: "center",
              }}
              //onPress={handleUpdate}
            >
              <Text style={styles.whiteText}>수정하기</Text>
            </TouchableOpacity>
          </ScrollView>
        )
      ) : (
        <ScrollView>
          <View style={styles.contentContainer}>
            <Text style={styles.subtitle}>맡을 날짜를 선택해주세요</Text>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                dateButtonSelected ? null : { backgroundColor: "#D9D9D9" },
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.whiteText}>
                {selectedDate.toDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                style={styles.dateTimePicker}
                value={selectedDate}
                mode={"date"}
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.subtitle}>맡을 시간을 선택해주세요</Text>

            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  startTimeButtonSelected
                    ? null
                    : { backgroundColor: "#D9D9D9" },
                ]}
                onPress={() => setShowStartTimePicker(true)}
              >
                <Text style={styles.whiteText}>
                  {selectedStartTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>
              {showStartTimePicker && (
                <DateTimePicker
                  style={styles.dateTimePicker}
                  value={selectedStartTime}
                  mode={"time"}
                  display="default"
                  is24Hour={true}
                  onChange={handleStartTimeChange}
                />
              )}
              <View style={styles.textBox}>
                <Text style={styles.darkgrayText}>부터</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  endTimeButtonSelected ? null : { backgroundColor: "#D9D9D9" },
                ]}
                onPress={() => setShowEndTimePicker(true)}
              >
                <Text style={styles.whiteText}>
                  {selectedEndTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>
              {showEndTimePicker && (
                <DateTimePicker
                  style={styles.dateTimePicker}
                  value={selectedEndTime}
                  mode={"time"}
                  display="default"
                  is24Hour={true}
                  onChange={handleEndTimeChange}
                />
              )}
              <View style={styles.textBox}>
                <Text style={styles.darkgrayText}>까지</Text>
              </View>
            </View>
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.subtitle}>맡을 장소를 선택해주세요</Text>

            <View style={{ marginVertical: 10 }} />

            <View
              style={[
                styles.placeBox,
                isPlaceBoxSelected ? { backgroundColor: "#A5D699" } : null,
              ]}
              onPress={handleMapPress}
            >
              <Text style={styles.whiteText}>
                {isPlaceBoxSelected ? selectedPlace : userInfo.address}
              </Text>
            </View>

            <TextInput
              style={[
                styles.placeBox,
                isDetailedAddressEntered
                  ? { backgroundColor: "#A5D699" }
                  : null,
                styles.whiteText,
                { textAlign: "center" },
              ]}
              placeholderTextColor={styles.whiteText.color}
              placeholder="상세 주소 입력"
              value={detailedAddress}
              onChangeText={handleDetailedAddressChange}
            />

            {region && (
              <MapView
                style={styles.map}
                region={region}
                provider="google"
                customMapStyle={[]}
                showsUserLocation={true}
                onPress={handleMapPress}
              >
                <Marker
                  coordinate={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                  }}
                />
              </MapView>
            )}
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.subtitle}>맡을 성별을 선택해주세요</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  selectedGender.includes("남자")
                    ? null
                    : { backgroundColor: "#D9D9D9" },
                ]}
                onPress={() => handleGenderSelection("남자")}
              >
                <Text style={styles.whiteText}>남자</Text>
              </TouchableOpacity>

              <View style={{ marginHorizontal: 10 }} />

              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  selectedGender.includes("여자")
                    ? null
                    : { backgroundColor: "#D9D9D9" },
                ]}
                onPress={() => handleGenderSelection("여자")}
              >
                <Text style={styles.whiteText}>여자</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.subtitle}>맡을 나이를 선택해주세요</Text>
            <View style={styles.toggleContainer}>
              <MultiSlider
                values={selectedAgeRange}
                sliderLength={300}
                onValuesChange={(values) => setSelectedAgeRange(values)}
                min={1}
                max={19}
                step={1}
                allowOverlap
                snapped
                unselectedStyle={{
                  backgroundColor: "#D9D9D9",
                }}
                selectedStyle={{
                  backgroundColor: "#A5D699",
                }}
                markerStyle={{
                  backgroundColor: "#A5D699",
                }}
                pressedMarkerStyle={{
                  backgroundColor: "#D9D9D9",
                }}
              />
            </View>

            <View style={styles.toggleContainer}>
              <View style={styles.textBox}>
                <Text style={styles.darkgrayText}>
                  {selectedAgeRange[0]}세 부터
                </Text>
              </View>

              <View style={styles.textBox}>
                <Text style={styles.darkgrayText}>
                  {selectedAgeRange[1]}세 까지
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: "#A5D699",
              padding: 15,
              borderRadius: 10,
              margin: 20,
              marginLeft: 40,
              marginRight: 40,
              alignItems: "center",
            }}
            onPress={handlePostData}
          >
            <Text style={styles.whiteText}>게시하기</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

export default TabScreen2;
