// TabNavigator.js

import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

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
            {tab.icon && <Image source={tab.icon} 
                                style={{ width: 27, height: 27 }} // 아이콘의 크기 조정
            />}
            
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
    justifyContent: 'space-between',  // 아이템 간의 간격을 최대로 설정
    paddingVertical: 5,
    paddingHorizontal: 15,
    height: 90, // 네비게이션 바의 높이를 조정
  },
  tabButton: {
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    margin: 1,
    marginBottom: 30,
  },
});

export default TabNavigator;
