// TabScreen2.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const TabScreen2 = () => {
  const [visibleToggle, setVisibleToggle] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartHour, setSelectedStartHour] = useState(null);
  const [selectedStartMinute, setSelectedStartMinute] = useState(null);
  const [selectedEndHour, setSelectedEndHour] = useState(null);
  const [selectedEndMinute, setSelectedEndMinute] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState("기본 주소"); // 나중에 여기에 기본 주소 값을 가져와야 하나?
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedStartAge, setSelectedStartAge] = useState(null);
  const [selectedEndAge, setSelectedEndAge] = useState(null);
  const [selectedStartAgeType, setSelectedStartAgeType] = useState(null);
  const [selectedEndAgeType, setSelectedEndAgeType] = useState(null);
  const [region, setRegion] = useState(null);
  const toggleVisibility = (toggleType) => {
    setVisibleToggle((prev) => (prev === toggleType ? null : toggleType));
  };

  const handleSelection = (value, toggleType) => {
    switch (toggleType) {
      case "year":
        setSelectedYear(value);
        break;
      case "month":
        setSelectedMonth(value);
        break;
      case "date":
        setSelectedDate(value);
        break;
      case "startHour":
        setSelectedStartHour(value === 0 ? 0 : value || null);
        //setSelectedStartHour(value);
        break;
      case "startMinute":
        setSelectedStartMinute(value === 0 ? 0 : value || null);
        //setSelectedStartMinute(value);
        break;
      case "endHour":
        setSelectedEndHour(value === 0 ? 0 : value || null);
        //setSelectedEndHour(value);
        break;
      case "endMinute":
        setSelectedEndMinute(value === 0 ? 0 : value || null);
        //setSelectedEndMinute(value);
        break;
      case "place":
        setSelectedPlace(value);
        break;
      case "startAge":
        setSelectedStartAge(value);
        break;
      case "endAge":
        setSelectedEndAge(value);
        break;
      case "startAgeType":
        setSelectedStartAgeType(value);
        break;
      case "endAgeType":
        setSelectedEndAgeType(value);
        break;
      default:
        break;
    }
    setVisibleToggle(null);
  };

  const handleGenderSelection = (gender) => {
    // 이미 선택된 성별이 있을 경우, 선택을 해제하고 새로운 선택을 추가
    if (selectedGender && selectedGender.includes(gender)) {
      setSelectedGender((prevGender) =>
        prevGender.filter((item) => item !== gender)
      );
    } else {
      // 선택된 성별이 없거나, 선택된 성별이 없는 경우 새로운 선택 추가
      setSelectedGender((prevGender) => [...(prevGender || []), gender]);
    }
    setVisibleToggle(null);
  };

  const PostButtonContainer = ({ onPress }) => (
    <View style={styles.postButtonContainer} onPress={onPress}>
      <TouchableOpacity style={styles.postButton}>
        <Text style={styles.whiteText}>게시하기</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOptions = (values, toggleType) => {
    return (
      <ScrollView contentContainerStyle={styles.optionsContainer}>
        {values.map((value, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleSelection(value, toggleType)}
          >
            <Text>{value}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
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
        const selectedAddress = `${address[0].region} ${address[0].city} ${address[0].street} ${address[0].name}`;
        setSelectedPlace(selectedAddress);
      }
    } catch (error) {
      console.error("주소를 가져오는 중 오류 발생:", error);
    }
  };

  const getDaysInMonth = (year, month) => {
    if (month === 2) {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
    } else if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
      return 31;
    } else {
      return 30;
    }
  };

  const getCurrentYear = new Date().getFullYear();
  const years = Array.from({ length: 2 }, (_, index) => getCurrentYear + index);
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const dates = Array.from(
    { length: getDaysInMonth(selectedYear, selectedMonth) },
    (_, index) => index + 1
  );
  const hours = Array.from({ length: 25 }, (_, index) => index);
  const minutes = Array.from({ length: 12 }, (_, index) => index * 5);
  // const places = ["기본 주소", "새로운 주소"];
  const ages = Array.from({ length: 36 }, (_, index) => index + 1);
  const types = ["세", "개월"];

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

  const handlePostData = async () => {
    // 데이터 포맷
    const currentYear = new Date().getFullYear();
    const formatStartAge = currentYear - selectedStartAge + 1;
    const formatEndAge = currentYear - selectedEndAge + 1;

    const formatMonth =
      selectedMonth && selectedMonth.toString().padStart(2, "0");
    const formatDate = selectedDate && selectedDate.toString().padStart(2, "0");
    const formatDateToSend = `${selectedYear}${formatMonth}${formatDate}`;

    const formatStartHour =
      selectedStartHour && selectedStartHour.toString().padStart(2, "0");
    const formatStartMinute =
      selectedStartMinute && selectedStartMinute.toString().padStart(2, "0");
    const formatEndHour =
      selectedEndHour && selectedEndHour.toString().padStart(2, "0");
    const formatEndMinute =
      selectedEndMinute && selectedEndMinute.toString().padStart(2, "0");

    let formatGender;
    if (selectedGender.includes("남자") && selectedGender.includes("여자")) {
      formatGender = "both";
    } else if (selectedGender.includes("남자")) {
      formatGender = "m";
    } else if (selectedGender.includes("여자")) {
      formatGender = "f";
    } else {
      formatGender = null; // 선택된 성별이 없는 경우
    }

    // POST에 필요한 데이터 정의
    const postData = {
      address: selectedPlace,
      child_age_from: formatStartAge,
      child_age_to: formatEndAge,
      date: formatDateToSend,
      start_time: formatStartHour * 100 + formatStartMinute,
      end_time: formatEndHour * 100 + formatEndMinute,
      gender: formatGender,
      email: "test3@example.com",
      id: "test3@example.com",
    };

    try {
      const response = await fetch(`http://pumasi.everdu.com/care`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      // 서버 응답 확인
      if (!response.ok) {
        console.error(`Server returned ${response.status}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderText}>맡기</Text>
      </View>
      <ScrollView>
        <View style={styles.dateContainer}>
          <Text style={styles.subtitle}>맡을 날짜를 선택해주세요</Text>

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => toggleVisibility("year")}
            >
              <Text
                style={selectedYear ? styles.darkgrayText : styles.grayText}
              >
                {selectedYear ? `${selectedYear}` : "year"}
              </Text>
              {visibleToggle === "year" && renderOptions(years, "year")}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => toggleVisibility("month")}
            >
              <Text
                style={selectedMonth ? styles.darkgrayText : styles.grayText}
              >
                {selectedMonth ? `${selectedMonth}` : "month"}
              </Text>
              {visibleToggle === "month" && renderOptions(months, "month")}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => toggleVisibility("date")}
            >
              <Text
                style={selectedDate ? styles.darkgrayText : styles.grayText}
              >
                {selectedDate ? `${selectedDate}` : "date"}
              </Text>
              {visibleToggle === "date" && renderOptions(dates, "date")}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.subtitle}>맡을 시간을 선택해주세요</Text>

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => toggleVisibility("startHour")}
            >
              <Text
                style={
                  selectedStartHour ? styles.darkgrayText : styles.grayText
                }
              >
                {selectedStartHour ? `${selectedStartHour}` : "00 시"}
              </Text>
              {visibleToggle === "startHour" &&
                renderOptions(hours, "startHour")}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => toggleVisibility("startMinute")}
            >
              <Text
                style={
                  selectedStartMinute ? styles.darkgrayText : styles.grayText
                }
              >
                {selectedStartMinute ? `${selectedStartMinute}` : "00 분"}
              </Text>
              {visibleToggle === "startMinute" &&
                renderOptions(minutes, "startMinute")}
            </TouchableOpacity>
            <View style={styles.timeBox}>
              <Text style={styles.darkgrayText}>부터</Text>
            </View>
          </View>

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => toggleVisibility("endHour")}
            >
              <Text
                style={selectedEndHour ? styles.darkgrayText : styles.grayText}
              >
                {selectedEndHour ? `${selectedEndHour}` : "00 시"}
              </Text>
              {visibleToggle === "endHour" && renderOptions(hours, "endHour")}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => toggleVisibility("endMinute")}
            >
              <Text
                style={
                  selectedEndMinute ? styles.darkgrayText : styles.grayText
                }
              >
                {selectedEndMinute ? `${selectedEndMinute}` : "00 분"}
              </Text>
              {visibleToggle === "endMinute" &&
                renderOptions(minutes, "endMinute")}
            </TouchableOpacity>
            <View style={styles.timeBox}>
              <Text style={styles.darkgrayText}>까지</Text>
            </View>
          </View>
        </View>

        <View style={styles.placeContainer}>
          <Text style={styles.subtitle}>맡을 장소를 선택해주세요</Text>

          <View style={styles.placeRow}>
            <View style={styles.placeContent}>
              <Text style={styles.darkgrayText}>{selectedPlace}</Text>
            </View>
          </View>

          <View style={styles.otherBox}>
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
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.subtitle}>필터를 설정해주세요</Text>

          {/* 성별 선택 버튼 */}
          <View style={styles.toggleContainer}>
            <View style={styles.placeBox}>
              <Text style={styles.lightgrayText}>성별</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                selectedGender &&
                  selectedGender.includes("남자") &&
                  styles.selectedButton,
              ]}
              onPress={() => handleGenderSelection("남자")}
            >
              <Text
                style={
                  selectedGender && selectedGender.includes("남자")
                    ? styles.whiteText
                    : styles.grayText
                }
              >
                남자
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                selectedGender &&
                  selectedGender.includes("여자") &&
                  styles.selectedButton,
              ]}
              onPress={() => handleGenderSelection("여자")}
            >
              <Text
                style={
                  selectedGender && selectedGender.includes("여자")
                    ? styles.whiteText
                    : styles.grayText
                }
              >
                여자
              </Text>
            </TouchableOpacity>
          </View>

          {/* 나이 선택 버튼 */}
          <View style={styles.toggleContainer}>
            <View style={styles.placeBox}>
              <Text style={styles.lightgrayText}>나이</Text>
            </View>

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => toggleVisibility("startAge")}
            >
              <Text
                style={selectedStartAge ? styles.darkgrayText : styles.grayText}
              >
                {selectedStartAge ? `${selectedStartAge}` : "0"}
              </Text>
              {visibleToggle === "startAge" && renderOptions(ages, "startAge")}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => toggleVisibility("startAgeType")}
            >
              <Text
                style={
                  selectedStartAgeType ? styles.darkgrayText : styles.grayText
                }
              >
                {selectedStartAgeType ? `${selectedStartAgeType}` : "세"}
              </Text>
              {visibleToggle === "startAgeType" &&
                renderOptions(types, "startAgeType")}
            </TouchableOpacity>

            <View style={styles.timeBox}>
              <Text style={styles.darkgrayText}>부터</Text>
            </View>
          </View>

          <View style={styles.toggleContainer}>
            <View style={styles.whiteBox}>
              <Text style={styles.whiteText}>나이</Text>
            </View>

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => toggleVisibility("endAge")}
            >
              <Text
                style={selectedEndAge ? styles.darkgrayText : styles.grayText}
              >
                {selectedEndAge ? `${selectedEndAge}` : "0"}
              </Text>
              {visibleToggle === "endAge" && renderOptions(ages, "endAge")}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => toggleVisibility("endAgeType")}
            >
              <Text
                style={
                  selectedEndAgeType ? styles.darkgrayText : styles.grayText
                }
              >
                {selectedEndAgeType ? `${selectedEndAgeType}` : "세"}
              </Text>
              {visibleToggle === "endAgeType" &&
                renderOptions(types, "endAgeType")}
            </TouchableOpacity>

            <View style={styles.timeBox}>
              <Text style={styles.darkgrayText}>까지</Text>
            </View>
          </View>
        </View>
        <PostButtonContainer onPress={handlePostData} />
      </ScrollView>
    </View>
  );
};

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
  dateContainer: {
    marginVertical: 20,
    marginHorizontal: 15,
  },
  timeContainer: {
    marginVertical: 20,
    marginHorizontal: 15,
  },
  placeContainer: {
    marginVertical: 20,
    marginHorizontal: 15,
  },
  filterContainer: {
    marginVertical: 20,
    marginHorizontal: 15,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: "#616161",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    marginRight: 10,
  },
  timeBox: {
    height: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  placeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 5,
  },
  placeBox: {
    width: 80,
    height: 40,
    backgroundColor: "#616161",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginRight: 10,
  },
  placeContent: {
    flex: 1,
    height: 40,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  otherBox: {
    marginVertical: 20,
    marginHorizontal: 15,
  },
  map: {
    flex: 1,
    height: 200,
  },
  selectedButton: {
    backgroundColor: "#A5D699",
  },
  postButtonContainer: {
    alignItems: "center",
    marginTop: 5,
    marginBottom: 30,
  },
  postButton: {
    backgroundColor: "#A5D699",
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
  },
  optionsContainer: {
    //maxHeight: 150,
    marginTop: 5,
    borderRadius: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  optionButton: {
    paddingVertical: 8,
    alignItems: "center",
  },
  lightgrayText: {
    fontSize: 18,
    color: "#F5F5F5",
  },
  whiteText: {
    fontSize: 18,
    color: "#ffffff",
  },
  grayText: {
    fontSize: 18,
    color: "#D9D9D9",
  },
  darkgrayText: {
    fontSize: 18,
    color: "#616161",
  },
  whiteBox: {
    width: 80,
    height: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginRight: 10,
  },
});

export default TabScreen2;
