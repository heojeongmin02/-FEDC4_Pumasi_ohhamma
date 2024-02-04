// TabScreen5.js

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { idToken } from "./LoginScreen";

const styles = StyleSheet.create({
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
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 10, // 스크롤 가능한 내용 아래 여백
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
    fontSize: 15,
    marginTop: 5,
    marginBottom: 3,
  },
  editButton: {
    backgroundColor: "#A5D699",
    marginTop: 10,
    marginBottom: 5,
    padding: 17,
    borderRadius: 15,
    alignItems: "center",
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  largeText: {
    fontSize: 20,
    marginTop: 3,
    marginBottom: 3,
  },
});

const TabHeader = ({ name }) => (
  <View style={styles.tabHeader}>
    <Text style={styles.tabHeaderText}>{name}</Text>
  </View>
);

const TabScreen5 = () => {
  const [userData, setUserData] = useState({
    name: "",
    point: "",
    address: "",
    introduce: "",
  });
  const [userChildData, setUserChildData] = useState([
    {
      name: "",
      gender: "",
      age: "",
      allergies: "",
      precautions: "",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://pumasi.everdu.com/user/test@example.com",
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
          setUserData(result);
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://pumasi.everdu.com/user/test@example.com/child",
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
          setUserChildData(result);
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const UserContentBox = ({ content }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleEditToggle = () => {
      setIsEditing(!isEditing);
    };

    return (
      <TouchableOpacity style={styles.box} onPress={handleEditToggle}>
        <Text style={styles.largeText}>{content.name}</Text>
        <Text style={styles.contentText}>별점: {content.point}</Text>
        <Text style={styles.contentText}>주소: {content.address}</Text>
        <Text style={styles.contentText}>소개: {content.introduce}</Text>
        {isEditing && (
          <View style={styles.editButton}>
            <Text style={styles.editButtonText}>편집</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const ChildContentBox = ({ content }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleEditToggle = () => {
      setIsEditing(!isEditing);
    };

    return (
      <TouchableOpacity style={styles.box} onPress={handleEditToggle}>
        <Text style={styles.largeText}>{content.name}</Text>
        <Text style={styles.contentText}>나이: {content.age}</Text>
        <Text style={styles.contentText}>
          성별: {content.gender === `m` ? `남아` : `여아`}
        </Text>
        <Text style={styles.contentText}>알러지: {content.allergies}</Text>
        <Text style={styles.contentText}>혈액형: {content.blood_type}</Text>
        <Text style={styles.contentText}>주의사항: {content.notes}</Text>
        {isEditing && (
          <View style={styles.editButton}>
            <Text style={styles.editButtonText}>편집</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TabHeader name="마이페이지" />
      <UserContentBox content={userData} />
      {userChildData.map((child, index) => (
        <ChildContentBox key={index} content={child} />
      ))}
    </View>
  );
};

export default TabScreen5;
