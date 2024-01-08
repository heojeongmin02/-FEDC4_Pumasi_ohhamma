// TabScreen2.js

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const TabScreen2 = () => {
  const [visibleToggle, setVisibleToggle] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartAmPm, setSelectedStartAmPm] = useState(null);
  const [selectedStartHour, setSelectedStartHour] = useState(null);
  const [selectedStartMinute, setSelectedStartMinute] = useState(null);
  const [selectedEndAmPm, setSelectedEndAmPm] = useState(null);
  const [selectedEndHour, setSelectedEndHour] = useState(null);
  const [selectedEndMinute, setSelectedEndMinute] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState("기본 주소");
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedStartAge, setSelectedStartAge] = useState(null);
  const [selectedEndAge, setSelectedEndAge] = useState(null);
  const [selectedStartAgeType, setSelectedStartAgeType] = useState(null);
  const [selectedEndAgeType, setSelectedEndAgeType] = useState(null);
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
      case "startAmPm":
        setSelectedStartAmPm(value);
        break;
      case "startHour":
        setSelectedStartHour(value);
        break;
      case "startMinute":
        setSelectedStartMinute(value);
        break;
      case "endAmPm":
        setSelectedEndAmPm(value);
        break;
      case "endHour":
        setSelectedEndHour(value);
        break;
      case "endMinute":
        setSelectedEndMinute(value);
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
    setSelectedGender(gender);
    setVisibleToggle(null);
  };

  const PostButtonContainer = () => (
    <View style={styles.postButtonContainer}>
      <TouchableOpacity style={styles.postButton}>
        <Text style={styles.whiteText}>게시하기</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOptions = (values, toggleType) => {
    return (
      <ScrollView
        style={styles.optionsContainer}
        contentContainerStyle={styles.scrollContent}
      >
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
  const hours = Array.from({ length: 12 }, (_, index) => index + 1);
  const minutes = Array.from({ length: 12 }, (_, index) => index * 5);
  const ampm = ["오전", "오후"];
  const places = ["기본 주소", "새로운 주소"];
  const ages = Array.from({ length: 36 }, (_, index) => index + 1);
  const types = ["세", "개월"];

  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderText}>맡기</Text>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.subtitle}>맡길 날짜를 선택해주세요</Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => toggleVisibility("year")}
          >
            <Text style={selectedYear ? styles.darkgrayText : styles.grayText}>
              {selectedYear ? `${selectedYear}` : "year"}
            </Text>
            {visibleToggle === "year" && renderOptions(years, "year")}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => toggleVisibility("month")}
          >
            <Text style={selectedMonth ? styles.darkgrayText : styles.grayText}>
              {selectedMonth ? `${selectedMonth}` : "month"}
            </Text>
            {visibleToggle === "month" && renderOptions(months, "month")}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => toggleVisibility("date")}
          >
            <Text style={selectedDate ? styles.darkgrayText : styles.grayText}>
              {selectedDate ? `${selectedDate}` : "date"}
            </Text>
            {visibleToggle === "date" && renderOptions(dates, "date")}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.subtitle}>맡길 시간을 선택해주세요</Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => toggleVisibility("startAmPm")}
          >
            <Text
              style={selectedStartAmPm ? styles.darkgrayText : styles.grayText}
            >
              {selectedStartAmPm ? `${selectedStartAmPm}` : "오전"}
            </Text>
            {visibleToggle === "startAmPm" && renderOptions(ampm, "startAmPm")}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => toggleVisibility("startHour")}
          >
            <Text
              style={selectedStartHour ? styles.darkgrayText : styles.grayText}
            >
              {selectedStartHour ? `${selectedStartHour}` : "00 시"}
            </Text>
            {visibleToggle === "startHour" && renderOptions(hours, "startHour")}
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
            onPress={() => toggleVisibility("endAmPm")}
          >
            <Text
              style={selectedEndAmPm ? styles.darkgrayText : styles.grayText}
            >
              {selectedEndAmPm ? `${selectedEndAmPm}` : "오전"}
            </Text>
            {visibleToggle === "endAmPm" && renderOptions(ampm, "endAmPm")}
          </TouchableOpacity>

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
              style={selectedEndMinute ? styles.darkgrayText : styles.grayText}
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
        <Text style={styles.subtitle}>맡길 장소를 선택해주세요</Text>

        <View style={styles.placeRow}>
          <View style={styles.placeBox}>
            <Text style={styles.lightgrayText}>기본 주소</Text>
          </View>
          <View style={styles.placeContent}>
            <Text style={styles.darkgrayText}>현대 2차 아파트 204동 301호</Text>
          </View>
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
              selectedGender === "남자" && styles.selectedButton,
            ]}
            onPress={() => handleGenderSelection("남자")}
          >
            <Text
              style={
                selectedGender === "남자" ? styles.whiteText : styles.grayText
              }
            >
              남자
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedGender === "여자" && styles.selectedButton,
            ]}
            onPress={() => handleGenderSelection("여자")}
          >
            <Text
              style={
                selectedGender === "여자" ? styles.whiteText : styles.grayText
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
              style={selectedEndAgeType ? styles.darkgrayText : styles.grayText}
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
      <PostButtonContainer />
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
  selectedButton: {
    backgroundColor: "#A5D699",
  },
  postButtonContainer: {
    alignItems: "center",
    marginTop: 5,
  },
  postButton: {
    backgroundColor: "#A5D699",
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
  },
  optionsContainer: {
    maxHeight: 150,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#E6E6E6",
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
