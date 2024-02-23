// TabScreen5.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Pressable,
  Button,
} from "react-native";
import { Rating } from "react-native-ratings";
import { idToken, userId } from "./LoginScreen";
import { width } from "deprecated-react-native-prop-types/DeprecatedImagePropType";

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
    paddingBottom: 100, // 스크롤 가능한 내용 아래 여백
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
    fontSize: 25,
    marginTop: 3,
    marginBottom: 6,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 10,
    padding: 8,
    marginTop: 5,
    marginBottom: 5,
  },
  addChildButtonText: {
    backgroundColor: "#A5D699",
    marginTop: 10,
    marginBottom: 5,
    padding: 17,
    borderRadius: 15,
    alignItems: "center",
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
  genderButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    marginVertical: 10,
  },
  genderButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    borderRadius: 10,
  },
  selectedGender: {
    backgroundColor: "#A5D699",
  },
  genderButtonText: {
    color: "white",
    fontSize: 16,
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
  iosShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  androidShadow: {
    elevation: 5,
  },
  largeText2: {
    fontSize: 25,
    marginTop: 20,
    marginLeft: 20,
  },
  deleteButton: {
    backgroundColor: "#cd5c5c",
    marginTop: 10,
    marginBottom: 5,
    padding: 17,
    borderRadius: 15,
    width: "30%",
    alignItems: "center",
  },
  realEditButton: {
    backgroundColor: "#A5D699",
    marginTop: 10,
    marginBottom: 5,
    padding: 17,
    borderRadius: 15,
    width: "68%",
    alignItems: "center",
  },
});

// 시간을 24시간 형식으로 변환하는 함수
const formatTime = (time) => {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  return `${hours < 10 ? "0" : ""}${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;
};

// 날짜를 한글 요일을 포함한 형식으로 변환하는 함수
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

// 탭헤더 컴포넌트
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
  const [childData, setChildData] = useState([
    {
      name: "",
      gender: "",
      age: "",
      allergies: "",
      precautions: "",
    },
  ]);
  const [newChildData, setNewChildData] = useState({
    name: "",
    gender: "",
    age: "",
    allergies: "",
    blood_type: "",
    notes: "",
  });
  const [careData, setCareData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // 아이 추가 버튼을 눌렀을 때 호출되는 함수
  const handleAddChild = async () => {
    if (
      newChildData.name &&
      newChildData.gender &&
      newChildData.age &&
      newChildData.allergies &&
      newChildData.blood_type &&
      newChildData.notes
    ) {
      try {
        const response = await fetch(
          `http://pumasi.everdu.com/user/${userId}/child`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${idToken}`,
            },
            body: JSON.stringify(newChildData),
          }
        );

        if (response.ok) {
          console.log("Child added successfully");
          alert("아이가 정상적으로 추가됐어요!");
          fetchChildData();
          setModalVisible(false);
        } else {
          console.error("Error adding child:", response.statusText);
        }
      } catch (error) {
        console.error("Error adding child:", error);
      }
    }
  };

  // 유저 정보를 가져오는 함수
  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://pumasi.everdu.com/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${idToken}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setUserData(result);
        console.log(result);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 유저 정보를 가져오는 useEffect
  useEffect(() => {
    fetchUserData();
  }, []);

  // 맡기기 정보를 가져오는 함수
  const fetchCareData = async () => {
    try {
      const response = await fetch(
        `http://pumasi.everdu.com/user/${userId}/care`, // 변경된 부분
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
        setCareData(result);
      } else {
        console.error("Error fetching care data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching care data:", error);
    }
  };

  // 맡기기 정보를 가져오는 useEffect
  useEffect(() => {
    fetchCareData();
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

  // fetchChildData 함수를 호출하는 useEffect
  useEffect(() => {
    fetchChildData();
  }, []);

  // 유저 정보 컴포넌트
  const UserContentBox = ({ content }) => {
    const [isClicked, setIsClicked] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUserData, setEditedUserData] = useState({
      address: content.address,
      introduce: content.introduce,
    });

    // 컨텐츠 박스를 클릭했을 때 호출되는 함수
    const handleContentBoxClick = () => {
      setIsClicked(!isClicked);
    };

    // 저장 버튼을 눌렀을 때 호출되는 함수
    const handleSavePress = () => {
      setIsEditing(false);
      fetch(`http://pumasi.everdu.com/user/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${idToken}`,
        },
        body: JSON.stringify(editedUserData),
      })
        .then((response) => {
          if (response.ok) {
            console.log("User updated successfully");
            fetchUserData();
          } else {
            console.error("Error updating user:", response.statusText);
          }
        })
        .catch((error) => {
          console.error("Error updating user:", error);
        });
    };

    // 편집 버튼을 눌렀을 때 호출되는 함수
    const handleEditPress = () => {
      setIsEditing(true);
    };

    return (
      <TouchableOpacity style={styles.box} onPress={handleContentBoxClick}>
        <Text style={styles.largeText}>{content.name}</Text>
        <Text style={styles.contentText}>보유 크레딧: {content.point}</Text>
        <Text style={styles.contentText}>주소: {content.address}</Text>
        <Text style={styles.contentText}>소개: {content.introduce}</Text>
        {isClicked &&
          (isEditing ? (
            <>
              <TextInput
                style={styles.inputBox}
                placeholder="새 주소"
                value={editedUserData.address}
                onChangeText={(text) =>
                  setEditedUserData((prevData) => ({
                    ...prevData,
                    address: text,
                  }))
                }
              />
              <TextInput
                style={styles.inputBox}
                placeholder="소개"
                value={editedUserData.introduce}
                onChangeText={(text) =>
                  setEditedUserData((prevData) => ({
                    ...prevData,
                    introduce: text,
                  }))
                }
              />
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleSavePress}
              >
                <Text style={styles.editButtonText}>저장</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditPress}
            >
              <Text style={styles.editButtonText}>편집</Text>
            </TouchableOpacity>
          ))}
      </TouchableOpacity>
    );
  };

  // 아이 정보 컴포넌트
  const ChildContentBox = ({ content }) => {
    const [isClicked, setIsClicked] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedChildData, setEditedChildData] = useState({
      allergies: content.allergies,
      notes: content.notes,
    });

    // 저장 버튼을 눌렀을 때 호출되는 함수
    const handleSavePress = () => {
      setIsEditing(false);
      fetch(
        `http://pumasi.everdu.com/user/${userId}/child/${content.child_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${idToken}`,
          },
          body: JSON.stringify(editedChildData),
        }
      )
        .then((response) => {
          if (response.ok) {
            console.log("Child updated successfully");
            fetchChildData();
          } else {
            console.error("Error updating child:", response.statusText);
          }
        })
        .catch((error) => {
          console.error("Error updating child:", error);
        });
    };

    // 아이 삭제 버튼을 눌렀을 때 호출되는 함수
    const handleDeletePress = () => {
      fetch(
        `http://pumasi.everdu.com/user/${userId}/child/${content.child_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${idToken}`,
          },
        }
      )
        .then((response) => {
          if (response.ok) {
            console.log("Child deleted successfully");
            fetchChildData();
          } else {
            console.error("Error deleting child:", response.statusText);
          }
        })
        .catch((error) => {
          console.error("Error deleting child:", error);
        });
    };

    // 나이 계산 함수
    const calculateAge = (birthYear) => {
      const currentYear = new Date().getFullYear();
      return currentYear - birthYear;
    };

    return (
      <TouchableOpacity
        style={styles.box}
        onPress={() => setIsClicked(!isClicked)}
      >
        <Text style={styles.largeText}>{content.name}</Text>
        <Text style={styles.contentText}>
          나이: {calculateAge(content.age)}세
        </Text>
        <Text style={styles.contentText}>
          성별: {content.gender === `m` ? `남아` : `여아`}
        </Text>
        <Text style={styles.contentText}>알러지: {content.allergies}</Text>
        <Text style={styles.contentText}>혈액형: {content.blood_type}</Text>
        <Text style={styles.contentText}>주의사항: {content.notes}</Text>
        {isClicked &&
          (isEditing ? (
            <>
              <TextInput
                style={styles.inputBox}
                placeholder="알러지"
                value={editedChildData.allergies}
                onChangeText={(text) =>
                  setEditedChildData((prevData) => ({
                    ...prevData,
                    allergies: text,
                  }))
                }
              />
              <TextInput
                style={styles.inputBox}
                placeholder="혈액형"
                value={editedChildData.blood_type}
                // onChangeText={(text) =>
                //   setEditedChildData((prevData) => ({
                //     ...prevData,
                //     blood_type: text,
                //   }))
                // }
              />
              <TextInput
                style={styles.inputBox}
                placeholder="주의사항"
                value={editedChildData.notes}
                onChangeText={(text) =>
                  setEditedChildData((prevData) => ({
                    ...prevData,
                    notes: text,
                  }))
                }
              />
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleSavePress}
              >
                <Text style={styles.editButtonText}>저장</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={styles.realEditButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>편집</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeletePress}
              >
                <Text style={styles.editButtonText}>삭제</Text>
              </TouchableOpacity>
            </View>
          ))}
      </TouchableOpacity>
    );
  };

  // 맡기기 정보 컴포넌트
  const CareContentBox = ({ content }) => {
    const [isClicked, setIsClicked] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);

    const handleDoneAndRate = () => {
      setIsClicked(!isClicked);
      setModalVisible(true);
    };

    // 리뷰 제출 함수
    const handleSubmitReview = () => {
      setModalVisible(false);

      const result = {
        rating: rating,
        point: 10,
      };

      fetch(`http://pumasi.everdu.com/care/${content.id}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${idToken}`,
        },
        body: JSON.stringify(result),
      })
        .then((response) => {
          if (response.ok) {
            console.log("Review submitted successfully");
            alert("리뷰가 정상적으로 제출됐어요!");
            fetchCareData();
          } else {
            console.error("Error submitting review:", response.status);
          }
        })
        .catch((error) => {
          console.error("Error submitting review:", error);
        });
    };

    return (
      <TouchableOpacity
        style={styles.box}
        onPress={() => setIsClicked(!isClicked)}
      >
        <Text style={styles.largeText}>{formatDate(content.date)}</Text>
        <Text style={styles.contentText}>
          {`${formatTime(content.start_time)} 부터 ${formatTime(
            content.end_time
          )} 까지 ${content.id}님에게`}
        </Text>
        <Text style={styles.contentText}>주소: {content.address}</Text>
        {isClicked && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleDoneAndRate}
          >
            <Text style={styles.editButtonText}>완료 및 평점 남기기</Text>
          </TouchableOpacity>
        )}

        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <View
            style={[
              styles.modalContainer,
              Platform.OS === "android"
                ? styles.androidShadow
                : styles.iosShadow,
            ]}
          >
            <View style={styles.modalContent}>
              <Rating
                type="star"
                ratingCount={5}
                imageSize={40}
                showRating
                onFinishRating={(rating) => setRating(rating)}
              />
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#E6E6E6",
                  borderRadius: 10,
                  padding: 8,
                  marginTop: 30,
                  marginBottom: 5,
                  height: 50,
                }}
                placeholder="리뷰를 입력해주세요"
                multiline
                onChangeText={(text) => setReview(text)}
              />
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleSubmitReview}
              >
                <Text style={styles.editButtonText}>확인</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => handleSubmitReview()}
              >
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TabHeader name="마이페이지" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <UserContentBox content={userData} />
        <Text style={styles.largeText2}>자녀 정보</Text>
        {childData.map((child, index) => (
          <ChildContentBox key={index} content={child} />
        ))}
        <TouchableOpacity
          style={styles.addChildButtonText}
          onPress={() => setModalVisible(true)} // 팝업 열기
        >
          <Text style={styles.editButtonText}>아이 추가</Text>
        </TouchableOpacity>
        <Text style={styles.largeText2}>예정된 맡기기 일정</Text>
        {careData.map((care, index) => (
          <CareContentBox key={index} content={care} />
        ))}
      </ScrollView>
      {/* 아이 추가 팝업 */}
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
            {/* 팝업 내부의 입력 필드들 */}
            <TextInput
              style={styles.inputBox}
              placeholder="이름"
              value={newChildData.name}
              onChangeText={(text) =>
                setNewChildData((prevData) => ({ ...prevData, name: text }))
              }
            />
            {/* 성별 선택 버튼 */}
            <View style={styles.genderButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  newChildData.gender === "m" && styles.selectedGender,
                ]}
                onPress={() =>
                  setNewChildData((prevData) => ({
                    ...prevData,
                    gender: "m",
                  }))
                }
              >
                <Text style={styles.genderButtonText}>남아</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  newChildData.gender === "f" && styles.selectedGender,
                ]}
                onPress={() =>
                  setNewChildData((prevData) => ({
                    ...prevData,
                    gender: "f",
                  }))
                }
              >
                <Text style={styles.genderButtonText}>여아</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.inputBox}
              placeholder="나이(년도)"
              value={newChildData.age !== "" ? newChildData.age.toString() : ""}
              onChangeText={(text) => {
                // 숫자 또는 빈 문자열인 경우에만 숫자로 변환하여 업데이트
                if (/^\d*$/.test(text)) {
                  setNewChildData((prevData) => ({
                    ...prevData,
                    age: text !== "" ? parseInt(text, 10) : "",
                  }));
                }
              }}
            />
            <TextInput
              style={styles.inputBox}
              placeholder="알러지"
              value={newChildData.allergies}
              onChangeText={(text) =>
                setNewChildData((prevData) => ({
                  ...prevData,
                  allergies: text,
                }))
              }
            />
            <TextInput
              style={styles.inputBox}
              placeholder="혈액형"
              value={newChildData.blood_type}
              onChangeText={(text) =>
                setNewChildData((prevData) => ({
                  ...prevData,
                  blood_type: text,
                }))
              }
            />
            <TextInput
              style={styles.inputBox}
              placeholder="주의사항"
              value={newChildData.notes}
              onChangeText={(text) =>
                setNewChildData((prevData) => ({ ...prevData, notes: text }))
              }
            />
            {/* 확인 버튼 */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleAddChild}
            >
              <Text style={styles.editButtonText}>확인</Text>
            </TouchableOpacity>
            {/* 팝업 닫기 버튼 */}
            <Pressable
              style={styles.modalCloseButton}
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

export default TabScreen5;
