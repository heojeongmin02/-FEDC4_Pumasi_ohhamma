// App.js

import React from 'react';
import TabNavigator from './TabNavigator';
import TabScreen1 from './screens/TabScreen1';
import TabScreen2 from './screens/TabScreen2';
import TabScreen3 from './screens/TabScreen3';
import TabScreen4 from './screens/TabScreen4';
import TabScreen5 from './screens/TabScreen5';

const tabs = [
  { name: 'Tab 1', component: TabScreen1 },
  { name: 'Tab 2', component: TabScreen2 },
  { name: 'Tab 3', component: TabScreen3 },
  { name: 'Tab 4', component: TabScreen4 },
  { name: 'Tab 5', component: TabScreen5 },
];

const App = () => {
  return <TabNavigator tabs={tabs} />;
};

export default App;
