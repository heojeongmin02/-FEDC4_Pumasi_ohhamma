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

const ContentBox = ({ content }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleContentBoxClick = () => {
    setIsClicked(!isClicked);
  };

  const handlePlaceChildClick = () => {
    // 맡기기 버튼이 클릭되었을 때 수행할 동작을 여기에 추가
    console.log(`Place child action for ${content.id}`);
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
        <Text style={styles.ContentBox}>{`${content.status}`}</Text>

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
              onPress={handlePlaceChildClick}
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

  const handleTogglePress = () => {
    setMapModeVisible(!mapModeVisible);
  };

  const handlePlaceChildClick = async (contentId) => {
    try {
      // Send a request to update the status of the content to "reserved"
      await fetch(`http://pumasi.everdu.com/care/${contentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Update the status locally in the data state
      setData((prevData) =>
        prevData.map((content) =>
          content.id === contentId
            ? { ...content, status: "reserved" }
            : content
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
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
          {data
            .filter((content) => content.status !== "reserved")
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

// 서버에 연결하지 않는 경우 사용하는 코드

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
// } from "react-native";
// import TabScreen1_mapmode from "./TabScreen1_mapmode";

// const sampleContents = [
// {
//   start_time: 1900,
//   date: "20240115",
//   child_age: 2013,
//   day: "mon",
//   rating: 4.2,
//   address: "서울시 마포구 와우산로 70 홍익대학교 T동 702",
//   end_time: 2000,
//   email: "test1@example.com",
//   status: "waiting",
//   gender: "f",
//   id: "test1@example.com",
// },
//   {
//     start_time: 2000,
//     date: "20240116",
//     child_age: 2010,
//     day: "tue",
//     rating: 3.8,
//     address: "서울시 강남구 역삼로 123 건물 5층",
//     end_time: 2130,
//     email: "test2@example.com",
//     status: "waiting",
//     gender: "m",
//     id: "test2@example.com",
//   },
//   {
//     start_time: 1800,
//     date: "20240117",
//     child_age: 2015,
//     day: "wed",
//     rating: 4.5,
//     address: "서울시 송파구 올림픽로 240 롯데월드몰 3층",
//     end_time: 1930,
//     email: "test3@example.com",
//     status: "waiting",
//     gender: "f",
//     id: "test3@example.com",
//   },
//   {
//     start_time: 1930,
//     date: "20240118",
//     child_age: 2012,
//     day: "thu",
//     rating: 4.0,
//     address: "서울시 강서구 마곡로 120 공항시티몰 2층",
//     end_time: 2100,
//     email: "test4@example.com",
//     status: "waiting",
//     gender: "m",
//     id: "test4@example.com",
//   },
//   {
//     start_time: 2000,
//     date: "20240119",
//     child_age: 2011,
//     day: "fri",
//     rating: 4.8,
//     address: "서울시 중구 명동길 22 소공로타워 10층",
//     end_time: 2130,
//     email: "test5@example.com",
//     status: "waiting",
//     gender: "f",
//     id: "test5@example.com",
//   },
// ];

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   tabHeader: {
//     height: 110,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#f0f0f0",
//   },
//   tabHeaderText: {
//     marginTop: 50,
//     marginLeft: 30,
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   contentContainer: {
//     flex: 1,
//     padding: 20,
//   },
//   scrollContent: {
//     paddingBottom: 10, // 스크롤 가능한 내용 아래 여백
//   },
//   toggleButton: {
//     backgroundColor: "#A5D699",
//     marginTop: 50,
//     marginRight: 15,
//     padding: 10,
//     borderRadius: 10,
//   },
//   toggleButtonText: {
//     color: "white",
//     fontSize: 16,
//     paddingHorizontal: 5,
//     fontWeight: "bold",
//   },
//   box: {
//     borderWidth: 1,
//     borderColor: "#E6E6E6",
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     paddingTop: 10,
//     paddingBottom: 10,
//     marginTop: 15,
//     marginHorizontal: 15,
//   },
//   horizontalBox: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   contentText: {
//     fontSize: 15,
//     marginTop: 5,
//     marginBottom: 3,
//   },
//   dateText: {
//     fontSize: 20,
//   },
//   timeText: {
//     fontSize: 20,
//   },
//   timeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   largeText: {
//     fontSize: 30,
//     fontWeight: "normal",
//   },
//   placeChildButton: {
//     backgroundColor: "#A5D699",
//     marginTop: 10,
//     marginBottom: 5,
//     padding: 17,
//     borderRadius: 15,
//     alignItems: "center",
//   },
//   placeChildButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// const formatTime = (time) => {
//   const hours = Math.floor(time / 100);
//   const minutes = time % 100;
//   return `${hours < 10 ? "0" : ""}${hours}:${
//     minutes < 10 ? "0" : ""
//   }${minutes}`;
// };

// const formatDate = (dateString) => {
//   const year = dateString.substring(0, 4);
//   const monthDay = dateString.substring(4);
//   const month = parseInt(monthDay.substring(0, 2), 10);
//   const day = parseInt(monthDay.substring(2), 10);

//   // JavaScript에서 월은 0부터 시작하므로 1을 더해줍니다.
//   const formattedDate = new Date(`${year}-${month}-${day}`);
//   const options = { weekday: "long" }; // 'long' 옵션을 통해 긴 형식의 요일을 가져옵니다.
//   const dayOfWeek = new Intl.DateTimeFormat("ko-KR", options).format(
//     formattedDate
//   );

//   return `${month}월 ${day}일 ${dayOfWeek}`;
// };

// const TabHeader = ({ name, onTogglePress, mapModeVisible }) => (
//   <View style={styles.tabHeader}>
//     <Text style={styles.tabHeaderText}>{name}</Text>
//     <TouchableOpacity style={styles.toggleButton} onPress={onTogglePress}>
//       <Text style={styles.toggleButtonText}>
//         {mapModeVisible ? "목록" : "지도"}
//       </Text>
//     </TouchableOpacity>
//   </View>
// );

// const ContentBox = ({ content }) => {
//   const [isClicked, setIsClicked] = useState(false);

//   const handleContentBoxClick = () => {
//     setIsClicked(!isClicked);
//   };

//   const handlePlaceChildClick = () => {
//     // 맡기기 버튼이 클릭되었을 때 수행할 동작을 여기에 추가
//     console.log(`Place child action for ${content.id}`);
//   };

//   return (
//     <TouchableOpacity onPress={handleContentBoxClick} activeOpacity={0.7}>
//       <View style={styles.box}>
//         <Text style={[styles.contentText, styles.dateText]}>{`${formatDate(
//           content.date
//         )}`}</Text>
//         <Text style={styles.timeContainer}>
//           <Text style={[styles.contentText, styles.timeText, styles.largeText]}>
//             {`${formatTime(content.start_time)}`}
//           </Text>
//           <Text style={[styles.contentText, styles.timeText]}>
//             {" "}
//             {`부터   `}
//           </Text>
//           <Text style={[styles.contentText, styles.timeText, styles.largeText]}>
//             {`${formatTime(content.end_time)}`}
//           </Text>
//           <Text style={[styles.contentText, styles.timeText]}> 까지</Text>
//         </Text>

//         <Text style={styles.contentText}>{`${content.address}`}</Text>

//         {isClicked && (
//           <View>
//             <View style={styles.horizontalBox}>
//               <Text style={styles.contentText}>{`${
//                 new Date().getFullYear() - content.child_age
//               }세, `}</Text>
//               <Text style={styles.contentText}>{`${
//                 content.gender === "m" ? "남아" : "여아"
//               }, `}</Text>
//               <Text
//                 style={styles.contentText}
//               >{`평점: ${content.rating}/5`}</Text>
//             </View>

//             <TouchableOpacity
//               onPress={handlePlaceChildClick}
//               activeOpacity={0.7}
//               style={styles.placeChildButton}
//             >
//               <Text style={styles.placeChildButtonText}>맡기기</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     </TouchableOpacity>
//   );
// };

// const TabScreen1 = ({ navigation }) => {
//   const [mapModeVisible, setMapModeVisible] = useState(false);

//   const handleTogglePress = () => {
//     setMapModeVisible(!mapModeVisible);
//   };

//   return (
//     <View style={styles.container}>
//       <TabHeader
//         name="맡기기"
//         onTogglePress={handleTogglePress}
//         mapModeVisible={mapModeVisible}
//       />

//       {mapModeVisible ? (
//         <TabScreen1_mapmode />
//       ) : (
//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           {sampleContents.map((content, index) => (
//             <ContentBox key={index} content={content} />
//           ))}
//         </ScrollView>
//       )}
//     </View>
//   );
// };

// export default TabScreen1;
