// TabScreen1_mapmode.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapModeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const TabScreen1_mapmode = () => (
  <View style={styles.container}>
    <Text style={styles.mapModeText}>Tab 1 Map Mode</Text>
  </View>
);

export default TabScreen1_mapmode;
