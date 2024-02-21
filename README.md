1. Install Expo Go.
2. Clone this repository.
3. Install the following libraries:
npm install react-native-maps
npm install react-native-unimodules
npm install @react-native-community/geolocation
npm install expo-location
npm install react-native-geocoding
npm install @react-native-community/datetimepicker
npm install @ptomasroos/react-native-multi-slider
npm install react-navigation react-navigation-stack react-native-gifted-chat
4. Enter the command npm start and scan the QR code.

(Additional information):
1. On the initial screen, after entering email, password, and password confirmation, clicking "회원가입" (Sign Up) and then "로그인" (Login) will log you in.
2. There is a bug in the timepicker on Android where it does not close; it is recommended to view it on an iPhone.
3. If you encounter errors related to the picker, enter the following two commands (refer to https://github.com/react-native-datetimepicker/datetimepicker/issues/808)
npm install expo@latest
npx expo install --fix

1. Expo Go 설치
2. 이 레포지토리 클론
3. 아래의 라이브러리 설치:
   - `npm install react-native-maps`
   - `npm install react-native-unimodules`
   - `npm install @react-native-community/geolocation`
   - `npm install expo-location`
   - `npm install react-native-geocoding`
   - `npm install @react-native-community/datetimepicker`
   - `npm install @ptomasroos/react-native-multi-slider`
   - `npm install react-navigation react-navigation-stack react-native-gifted-chat`
4. 명령어 `npm start` 입력하고 QR 코드를 스캔합니다.

   (+) 초기 화면에서 이메일, 비밀번호, 비밀번호 확인을 모두 입력한 후 "회원가입"을 누르고, 그 후 "로그인"을 누르면 로그인됩니다.

   (+) 안드로이드에서는 timepicker가 닫히지 않는 버그가 있어서 아이폰으로 확인하는 것이 좋습니다.

   (+) Picker 관련 오류가 발생하면 (https://github.com/react-native-datetimepicker/datetimepicker/issues/808)를 참고하여 아래 두 명령어를 입력합니다:
       ```
       npm install expo@latest
       npx expo install --fix
       ```


