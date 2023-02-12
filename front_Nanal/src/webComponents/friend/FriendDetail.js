import React, { useEffect, useState } from 'react';
import axios_api from '../../config/Axios';
import { onLogin } from '../../config/Login';

function FriendDetail(userIdx) {

  const [friend, setFriend] = useState([]);

  useEffect(() => {
    onLogin();
    axios_api
      .get(`/friend/${userIdx.userIdx}`)
      .then(({ data }) => {
        if (data.statusCode === 200) {
          setFriend(null);
          if (data.data.responseMessage === '친구 조회 성공') {
            setFriend(data.data.friend);
          }
        } else {
          console.log('친구 상세 보기 오류: ');
          console.log(data.statusCode);
          console.log(data.data.responseMessage);
        }
      })
      .catch(({ error }) => {
        console.log('친구 상세 보기 오류: ' + error);
      });
  }, [userIdx]);

  return (
    <div>
      <div className='flex mt-5 justify-evenly'>
        <img src={friend.img} className='p-1 rounded-full w-28 h-28' alt='friend-img'></img>
        <div className='p-1 my-auto font-bold'>
          <p className=''>
            <span className='mr-1.5 text-2xl'>{friend.nickname}</span>
            <span>님의</span>
          </p>
          <p className='my-0.5'>일기장</p>
        </div>
      </div>
      <div className='flex justify-between my-3'>
        <p>{friend.introduction}</p>
      </div>
      <hr className='my-2 border-dashed border-slate-400/75 w-65' />
    </div>
  );
}

export default FriendDetail;