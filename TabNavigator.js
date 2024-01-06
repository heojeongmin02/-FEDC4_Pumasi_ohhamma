// TabNavigator.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TabNavigator = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  const renderScreen = () => {
    const TabComponent = tabs[activeTab].component;
    return <TabComponent />;
  };

  return (
    <View style={styles.container}>
      {renderScreen()}

      <View style={styles.navigationBar}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabButton,
              {
                backgroundColor: index === activeTab ? '#e0e0e0' : 'transparent',
              },
            ]}
            onPress={() => setActiveTab(index)}
          >
            <Text>{tab.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigationBar: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    height: 90, // 네비게이션 바의 높이를 조정
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 5,
    marginBottom: 20,
  },
});

export default TabNavigator;
