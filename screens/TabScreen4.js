// TabScreen4.js

import React from "react";
import { View, Text, StyleSheet } from "react-native";

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
});

const TabHeader = ({ name }) => (
  <View style={styles.tabHeader}>
    <Text style={styles.tabHeaderText}>{name}</Text>
  </View>
);

const TabScreen4 = () => (
  <View style={{ flex: 1 }}>
    <TabHeader name="채팅" />

    <View style={styles.contentContainer}>
      <Text>Tab 4 Content</Text>
    </View>
  </View>
);

export default TabScreen4;
