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
} from "react-native";
import { idToken, userId } from "./LoginScreen";

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
  },
  modalContent: {
    width: "80%", // 모달의 너비를 80%로 설정
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

  // 기능: 아이를 추가했을때 서버에도 반영하고, 서버 반영을 성공하면 로컬에도 적용함
  const handleAddChild = () => {
    console.log(newChildData);
    if (
      newChildData.name &&
      newChildData.gender &&
      newChildData.age &&
      newChildData.allergies &&
      newChildData.blood_type &&
      newChildData.notes
    ) {
      fetch(`http://pumasi.everdu.com/user/${userId}/child`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${idToken}`,
        },
        body: JSON.stringify(newChildData),
      })
        .then((response) => {
          // HTTP 상태 코드 확인
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // 서버 응답이 JSON 형식인 경우
          console.log(data);
          if (data.success) {
            setChildData((prevData) => [...prevData, { ...newChildData }]);
            setNewChildData({
              name: "",
              gender: "",
              age: "",
              allergies: "",
              blood_type: "",
              notes: "",
            });
            setModalVisible(false);
          } else {
            alert("서버 응답이 올바르지 않습니다.");
          }
        })
        .catch((error) => {
          // 서버 응답이 JSON 형식이 아닌 경우 또는 네트워크 오류 등
          console.error("Error:", error);
          alert("서버 응답이 올바르지 않습니다.");
        });
    } else {
      alert("모든 필드를 입력해주세요.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://pumasi.everdu.com/user/${userId}`,
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
          console.log(result);
        } else {
          console.error("Error fetching care data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching care data:", error);
      }
    };

    fetchCareData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);

  const UserContentBox = ({ content }) => {
    const [isClicked, setIsClicked] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUserData, setEditedUserData] = useState({
      address: content.address,
      introduce: content.introduce,
    });

    const handleContentBoxClick = () => {
      setIsClicked(!isClicked);
    };

    const handleSavePress = () => {
      // 여기에 저장 동작 구현
      setIsEditing(false);
      setUserData((prevData) => ({
        ...prevData,
        address: editedUserData.address,
        introduce: editedUserData.introduce,
      }));
    };

    const handleEditPress = () => {
      // 여기에 편집 모드 전환 동작 구현
      setIsEditing(true);
    };

    return (
      <TouchableOpacity style={styles.box} onPress={handleContentBoxClick}>
        <Text style={styles.largeText}>{content.name}</Text>
        <Text style={styles.contentText}>별점: {content.point}</Text>
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
                placeholder="새 소개"
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

  const ChildContentBox = ({ content }) => {
    const [isClicked, setIsClicked] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedChildData, setEditedChildData] = useState({
      name: content.name,
      allergies: content.allergies,
      blood_type: content.blood_type,
      notes: content.notes,
    });

    const handleContentBoxClick = () => {
      setIsClicked(!isClicked);
    };

    const handleSavePress = () => {
      setIsEditing(false);

      setChildData((prevData) => {
        return prevData.map((child) => {
          if (child.name === editedChildData.name) {
            // name이 일치하는 경우 아이템 업데이트
            return {
              ...child,
              allergies: editedChildData.allergies,
              blood_type: editedChildData.blood_type,
              notes: editedChildData.notes,
            };
          } else {
            return child; // 아이템을 찾지 못하면 원래의 값을 그대로 유지
          }
        });
      });
    };

    const handleEditPress = () => {
      // 여기에 편집 모드 전환 동작 구현
      setIsEditing(true);
    };

    return (
      <TouchableOpacity style={styles.box} onPress={handleContentBoxClick}>
        <Text style={styles.largeText}>{content.name}</Text>
        <Text style={styles.contentText}>나이: {content.age}</Text>
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
                placeholder="새 알러지"
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
                placeholder="새 혈액형"
                value={editedChildData.blood_type}
                onChangeText={(text) =>
                  setEditedChildData((prevData) => ({
                    ...prevData,
                    blood_type: text,
                  }))
                }
              />
              <TextInput
                style={styles.inputBox}
                placeholder="새 주의사항"
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

  const CareContentBox = ({ content }) => {
    // 맡기기 정보에 대한 렌더링 로직 추가
    return (
      <TouchableOpacity style={styles.box}>
        {/* 맡기기 정보에 대한 텍스트 또는 컴포넌트 렌더링 */}
        {/* 예시로 간단한 텍스트를 표시하도록 하였습니다. 실제 데이터에 따라 수정이 필요합니다. */}
        <Text style={styles.largeText}>{content.careName}</Text>
        <Text style={styles.contentText}>맡긴 날짜: {content.startDate}</Text>
        <Text style={styles.contentText}>받은 날짜: {content.endDate}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TabHeader name="마이페이지" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <UserContentBox content={userData} />
        {childData.map((child, index) => (
          <ChildContentBox key={index} content={child} />
        ))}
        {careData.map((care, index) => (
          <CareContentBox key={index} content={care} />
        ))}
        <TouchableOpacity
          style={styles.addChildButtonText}
          onPress={() => setModalVisible(true)} // 팝업 열기
        >
          <Text style={styles.editButtonText}>아이 추가</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        animationType="slide"
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
