// TabScreen1_mapmode.js

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geocoder from "react-native-geocoding";
import * as Location from "expo-location";

const sampleContents = [
  {
    start_time: 1900,
    date: "20240115",
    child_age: 2013,
    day: "mon",
    rating: 4.2,
    address: "264, Gaepo-ro, Gangnam-gu, Seoul, Republic of Korea",
    end_time: 2000,
    email: "test1@example.com",
    status: "waiting",
    gender: "f",
    id: "test1@example.com",
  },
  {
    start_time: 2000,
    date: "20240116",
    child_age: 2010,
    day: "tue",
    rating: 3.8,
    address: "Ruskin Park London",
    end_time: 2130,
    email: "test2@example.com",
    status: "waiting",
    gender: "m",
    id: "test2@example.com",
  },
  {
    start_time: 1800,
    date: "20240117",
    child_age: 2015,
    day: "wed",
    rating: 4.5,
    address: "Buckingham Palace London",
    end_time: 1930,
    email: "test3@example.com",
    status: "waiting",
    gender: "f",
    id: "test3@example.com",
  },
  {
    start_time: 1930,
    date: "20240118",
    child_age: 2012,
    day: "thu",
    rating: 4.0,
    address: "서울시 강서구 마곡로 120 공항시티몰 2층",
    end_time: 2100,
    email: "test4@example.com",
    status: "waiting",
    gender: "m",
    id: "test4@example.com",
  },
  {
    start_time: 2000,
    date: "20240119",
    child_age: 2011,
    day: "fri",
    rating: 4.8,
    address: "개포래미안포레스트",
    end_time: 2130,
    email: "test5@example.com",
    status: "waiting",
    gender: "f",
    id: "test5@example.com",
  },
];

const TabScreen1_mapmode = () => {
  const [region, setRegion] = useState(null);
  const [markers, setMarkers] = useState([]);

  const GOOGLE_MAPS_API_KEY = "AIzaSyAFAKESEokQqhqHi9hNx-ZUn-9fabPWNj4";
  Geocoder.init(GOOGLE_MAPS_API_KEY);

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
        sampleContents.map(async (content) => {
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
              latitude: geocode[0]?.geometry.location.lat,
              longitude: geocode[0]?.geometry.location.lng,
            },
          };
        })
      );
      // 지오코딩된 좌표로 마커 설정
      setMarkers(geocodedMarkers);
    })();
  }, []);

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
          {markers.map((content) => (
            <Marker
              key={content.id}
              coordinate={{
                latitude: content.location?.latitude || 0,
                longitude: content.location?.longitude || 0,
              }}
              title={content.address}
              description={`평점: ${content.rating}`}
            />
          ))}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  map: {
    flex: 1,
  },
});

export default TabScreen1_mapmode;
