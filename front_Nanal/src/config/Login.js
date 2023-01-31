import axios_api from './Axios';
import { getCookie } from './Cookie';

const JWT_EXPIRY_TIME = 24 * 3600 * 1000; // 만료 시간 (24시간 밀리 초로 표현)

export function onLogin(check) {
  if (check === true) {
    // accessToken 설정
    axios_api.defaults.headers.common['Authorization'] = `Bearer ${getCookie(
      'accessToken'
    )}`;
  } else {
    alert('로그인 후 접근 가능해요!');
    window.location.replace('/SignIn');
  }

  // accessToken 만료하기 1분 전에 로그인 연장
  // setTimeout(onSilentRefresh, JWT_EXPIRY_TIME - 60000);
}

// const onSilentRefresh = () => {
//   axios_api
//     .post('/silent-refresh')
//     .then(onLoginSuccess)
//     .catch((error) => {
//       // ... 로그인 실패 처리
//     });
// };

// export const onLoginFalse = () => {};