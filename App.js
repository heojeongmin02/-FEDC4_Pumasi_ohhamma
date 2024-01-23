// App.js

import React, { useState } from "react";
import TabNavigator from "./TabNavigator";
import TabScreen1 from "./screens/TabScreen1";
import TabScreen2 from "./screens/TabScreen2";
import TabScreen3 from "./screens/TabScreen3";
import TabScreen4 from "./screens/TabScreen4";
import TabScreen5 from "./screens/TabScreen5";
import LoginScreen from "./screens/LoginScreen";

const tabs = [
  {
    name: "Tab 1",
    component: TabScreen1,
    icon: require("./assets/icons/home.png"),
  },
  {
    name: "Tab 2",
    component: TabScreen2,
    icon: require("./assets/icons/care.png"),
  },
  {
    name: "Tab 3",
    component: TabScreen3,
    icon: require("./assets/icons/copy.png"),
  },
  {
    name: "Tab 4",
    component: TabScreen4,
    icon: require("./assets/icons/chat.png"),
  },
  {
    name: "Tab 5",
    component: TabScreen5,
    icon: require("./assets/icons/user.png"),
  },
];

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 저장하는 state
  // 로그인된 상태에서는 탭 화면을 보여주고, 그렇지 않은 경우 로그인 화면을 보여줌
  return isLoggedIn ? (
    <TabNavigator tabs={tabs} />
  ) : (
    <LoginScreen onLogin={() => setIsLoggedIn(true)} />
  );
};

export default App;
