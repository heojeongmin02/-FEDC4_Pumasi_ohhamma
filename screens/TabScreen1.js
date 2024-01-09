// TabScreen1.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import TabScreen1_mapmode from './TabScreen1_mapmode';

const sampleContents = [
  { date: '2024-01-15', time: '08:30 AM', age: 25, gender: 'Male', address: '123 Main St' },
  { date: '2024-01-16', time: '09:45 AM', age: 30, gender: 'Female', address: '456 Oak St' },
  { date: '2024-01-17', time: '11:15 AM', age: 35, gender: 'Male', address: '789 Pine St' },
  { date: '2024-01-18', time: '01:30 PM', age: 40, gender: 'Female', address: '101 Elm St' },
  { date: '2024-01-19', time: '03:45 PM', age: 45, gender: 'Male', address: '202 Maple St' },
  { date: '2024-01-20', time: '05:00 PM', age: 50, gender: 'Female', address: '303 Cedar St' },
  { date: '2024-01-21', time: '06:30 PM', age: 55, gender: 'Male', address: '404 Birch St' },
  { date: '2024-01-22', time: '08:00 PM', age: 60, gender: 'Female', address: '505 Pine St' },
  { date: '2024-01-23', time: '09:15 PM', age: 65, gender: 'Male', address: '606 Oak St' },
  { date: '2024-01-24', time: '10:30 PM', age: 70, gender: 'Female', address: '707 Maple St' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabHeader: {
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  tabHeaderText: {
    marginTop: 50,
    marginLeft: 30,
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 10, // 스크롤 가능한 내용 아래 여백
  },
  toggleButton: {
    backgroundColor: '#A5D699',
    marginTop: 50,
    marginRight: 15,
    padding: 10,
    borderRadius: 10,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 5,
    fontWeight: 'bold',
  },
  box: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 15,
    marginHorizontal:15,
  },
  contentText: {
    fontSize: 16,
    marginBottom: 5,
  },
  contentText: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 20, 
  },
  timeText: {
    fontSize: 20, 
  },
});

const TabHeader = ({ name, onTogglePress, mapModeVisible }) => (
  <View style={styles.tabHeader}>
    <Text style={styles.tabHeaderText}>{name}</Text>
    <TouchableOpacity style={styles.toggleButton} onPress={onTogglePress}>
      <Text style={styles.toggleButtonText}>{mapModeVisible ? '목록' : '지도'}</Text>
    </TouchableOpacity>
  </View>
);

const ContentBox = ({ content }) => (
  <View style={styles.box}>
    <Text style={[styles.contentText, styles.dateText]}>{`${content.date}`}</Text>
    <Text style={[styles.contentText, styles.timeText]}>{`${content.time}`}</Text>
    <Text style={styles.contentText}>{`Age: ${content.age}`}</Text>
    <Text style={styles.contentText}>{`Gender: ${content.gender}`}</Text>
    <Text style={styles.contentText}>{`Address: ${content.address}`}</Text>
  </View>
);

const TabScreen1 = ({ navigation }) => {
  const [mapModeVisible, setMapModeVisible] = useState(false);

  const handleTogglePress = () => {
    setMapModeVisible(!mapModeVisible);
  };

  return (
    <View style={styles.container}>
  <TabHeader name="맡기기" onTogglePress={handleTogglePress} mapModeVisible={mapModeVisible}/>

  {mapModeVisible ? (
    <TabScreen1_mapmode />
  ) : (
    <ScrollView contentContainerStyle={styles.scrollContent}>
          {sampleContents.map((content, index) => (
      <ContentBox key={index} content={content} />
    ))}
        </ScrollView>
  )}
</View>

  );
};

export default TabScreen1;
