1. **Install Expo Go.**
2. **Clone this repository.**
3. **Install the following libraries:**
   - `npm install react-native-maps`
   - `npm install react-native-unimodules`
   - `npm install @react-native-community/geolocation`
   - `npm install expo-location`
   - `npm install react-native-geocoding`
   - `npm install @react-native-community/datetimepicker`
   - `npm install @ptomasroos/react-native-multi-slider`
   - `npm install react-navigation react-navigation-stack react-native-gifted-chat`
4. **Enter the command `npm start` and scan the QR code.**

**Additional information:**
1. On the initial screen, after entering email, password, and password confirmation, clicking "회원가입" (Sign Up) and then "로그인" (Login) will log you in.
2. There is a bug in the timepicker on Android where it does not close; it is recommended to view it on an iPhone.
3. If you encounter errors related to the picker, enter the following two commands (refer to [this issue](https://github.com/react-native-datetimepicker/datetimepicker/issues/808)):
   - `npm install expo@latest`
   - `npx expo install --fix`
