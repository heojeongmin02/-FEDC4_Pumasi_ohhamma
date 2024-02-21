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

<Korean>
1. expo go 설치
2. 이 레포지토리 클론
3. 아래의 라이브러리 설치
npm install react-native-maps
npm install react-native-unimodules
npm install @react-native-community/geolocation
npm install expo-location npm install react-native-geocoding npm install @react-native-community/datetimepicker
npm install @ptomasroos/react-native-multi-slider
npm install react-navigation react-navigation-stack react-native-gifted-chat
4. npm start 명령어 입력하고 qr코드를 스캔

+) 초기 화면에서 email과 비밀번호, 비밀번호 확인 칸을 모두 입력 후, 회원가입을 누른 후 로그인을 누르면 로그인 됨
+) 안드로이드에서  timepicker가 꺼지지 않는 버그가 있어 아이폰으로 보는것을 추천
+) picker 관련 오류 발생시 아래의 두 명령어 입력 (https://github.com/react-native-datetimepicker/datetimepicker/issues/808 참고)
  npm install expo@latest
  npx expo install --fix


