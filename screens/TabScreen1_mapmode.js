// TabScreen1_mapmode.js

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geocoder from "react-native-geocoding";
import * as Location from "expo-location";

const TabScreen1_mapmode = ({ data }) => {
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
