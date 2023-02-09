import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import axios_api from '../../config/Axios';
import { onLogin } from '../../config/Login';

function GroupUpdate() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [groupIdx, setGroupIdx] = useState(0);
  const [groupName, setGroupName] = useState('');
  const [groupTag, setGroupTag] = useState([]);
  const [groupImg, setGroupImg] = useState('');
  const [groupImgIdx, setGroupImgIdx] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [isImgChecked, setIsImgChecked] = useState(false);

  let currentName = useRef('');
  let currentTag = useRef(['', '', '', '', '']);

  const [groupFriendList, setGroupFriendList] = useState([]);
  const [groupNotFriendList, setGroupNotFriendList] = useState([]);
  const [includeFriend, setIncludeFriend] = useState([]);
  const [includeFriendIdx, setIncludeFriendIdx] = useState([]);

  // tag 변경 시 요청되는 함수
  const updateTag = (e, idx) => {
    const newTag = e.target.value;
    // currentTag.current[idx].tag = newTag;
    currentTag.current[idx] = newTag;

    // setGroupTag(
    //   groupTag.map((it) => (it.tagIdx === idx ? { ...it, tag: newTag } : it))
    // );
  };

  // 그룹 이미지 upload
  const formData = new FormData();

  // 그룹 이미지 기본으로 되돌리기
  const onUploadBaseImage = (e) => {
    e.preventDefault();
    setIsImgChecked(true);

    // formData.delete('multipartFile');
    setImageFile(null);
  };

  const onUploadImage = (e) => {
    // e.preventDefault();
    setIsImgChecked(true);

    if (!e.target.files) {
      return;
    }

    // formData.append('multipartFile', e.target.files[0]);
    setImageFile(e.target.files[0]);
  };

  // const currentFriend = useRef([{}]);

  // 초대할 사용자 추가
  const addFriend = (idx) => {
    if (!includeFriend.includes(groupNotFriendList[idx])) {
      let addfriendList = [...includeFriend];
      addfriendList.push(groupNotFriendList[idx]);
      setIncludeFriend(addfriendList);

      let addfriendListIdx = [...includeFriendIdx];
      addfriendListIdx.push(groupNotFriendList[idx].userIdx);
      setIncludeFriendIdx(addfriendListIdx);
    }
  };

  // 초대할 사용자 제거
  const onChangeFRemove = (idx) => {
    let addfriendList = [...includeFriend];
    addfriendList.splice(idx, 1);
    setIncludeFriend(addfriendList);

    let addfriendListIdx = [...includeFriendIdx];
    addfriendListIdx.splice(idx, 1);
    setIncludeFriendIdx(addfriendListIdx);
  };

  // 그룹 수정 요청 함수
  const GroupUpdate = (e) => {
    e.preventDefault();

    let isCurrentGTName = true;

    for (const idx in groupTag) {
      if (currentTag.current[idx].length >= 10) {
        isCurrentGTName = false;
      }
    }

    if (currentName.current.length >= 15) {
      alert('그룹명은 15글자 이하로 입력해주세요!');
    } else if (isCurrentGTName === false) {
      alert('태그명은 10글자 이하로 입력해주세요!');
    } else {
      // setGroupName(currentName.current);
      // setGroupTag(currentTag.current);
      axios_api
        .put('/group', {
          groupIdx: groupIdx,
          // groupName: groupName,
          // tags: groupTag,
          groupName: currentName.current,
          tags: currentTag.current,
        })
        .then(({ data }) => {
          if (data.statusCode === 200) {
            if (data.data.responseMessage === '그룹 수정 성공') {
              // console.log(data.data.groupDetail);
              // console.log(data.data.tags);
              const groupidx = data.data.groupDetail.groupIdx;

              if (isImgChecked === true) {
                // 이미지를 변경하는 경우
                const dataSet = {
                  groupIdx: groupidx,
                  // groupImgIdx: groupImgIdx,
                };

                formData.append(
                  'value',
                  new Blob([JSON.stringify(dataSet)], {
                    type: 'application/json',
                  })
                );

                if (imageFile === null) {
                  formData.append('multipartFile', null);
                } else {
                  formData.append('multipartFile', imageFile);
                }

                // 이미지 업로드
                axios_api
                  .put('file/s3', formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  })
                  .then(({ data }) => {
                    if (data.statusCode === 200) {
                      if (data.data.responseMessage === '그림 저장 성공') {
                        // console.log(data.data);
                        if (includeFriend.size !== 0) {
                          // 그룹에 추가할 친구가 있는 경우
                          axios_api
                            .post('notification/group', {
                              request_group_idx: groupidx,
                              userIdx: includeFriendIdx,
                            })
                            .then(({ data }) => {
                              if (data.statusCode === 200) {
                                if (
                                  data.data.responseMessage === '알림 저장 성공'
                                ) {
                                  navigate(`/Group/Setting`, {
                                    state: { groupIdx: groupidx },
                                    replace: true,
                                  });
                                }
                              } else {
                                console.log('알림 저장 오류 : ');
                                console.log(data.statusCode);
                                console.log(data.data.responseMessage);
                              }
                            })
                            .catch(({ error }) => {
                              console.log('알림 저장 오류 : ' + error);
                            });
                        }
                      }
                    } else {
                      console.log('그림 저장 오류 : ');
                      console.log(data.statusCode);
                      console.log(data.data.responseMessage);
                    }
                  })
                  .catch(({ error }) => {
                    console.log('그림 저장 오류 : ' + error);
                  });
              } else {
                // 이미지를 변경하지 않는 경우
                // 그룹에 추가할 친구가 있는 경우
                axios_api
                  .post('notification/group', {
                    request_group_idx: groupidx,
                    userIdx: includeFriendIdx,
                  })
                  .then(({ data }) => {
                    if (data.statusCode === 200) {
                      if (data.data.responseMessage === '알림 저장 성공') {
                        navigate(`/Group/Setting`, {
                          state: { groupIdx: groupidx },
                          replace: true,
                        });
                      }
                    } else {
                      console.log('알림 저장 오류 : ');
                      console.log(data.statusCode);
                      console.log(data.data.responseMessage);
                    }
                  })
                  .catch(({ error }) => {
                    console.log('알림 저장 오류 : ' + error);
                  });
              }
            }
          } else {
            console.log('그룹 수정 오류 : ');
            console.log(data.statusCode);
            console.log(data.data.responseMessage);
          }
        })
        .catch(({ error }) => {
          console.log('그룹 수정 오류 : ' + error);
        });
    }
  };

  useEffect(() => {
    onLogin();
    axios_api
      .get(`/group/${state.groupDetail}`)
      .then(({ data }) => {
        if (data.statusCode === 200) {
          setGroupName(null);
          setGroupTag(null);
          currentName.current = [];
          if (data.data.responseMessage === '그룹 조회 성공') {
            // console.log(data.data.groupDetail);
            setGroupIdx(data.data.groupDetail.groupIdx);
            setGroupName(data.data.groupDetail.groupName);
            setGroupTag(data.data.tags);
            setGroupImg(data.data.groupDetail.imgUrl);
            setGroupImgIdx(data.data.groupDetail.groupImgIdx);
            const groupidx = data.data.groupDetail.groupIdx;
            currentName.current = data.data.groupDetail.groupName;
            // currentTag.current = data.data.tags;

            for (const tagging in data.data.tags) {
              currentTag.current[tagging] = data.data.tags[tagging].tag;
            }

            axios_api
              .get(`group/user/${groupidx}`)
              .then(({ data }) => {
                if (data.statusCode === 200) {
                  setGroupFriendList(null);
                  if (data.data.responseMessage === '그룹 유저 조회 성공') {
                    setGroupFriendList(data.data.groupUserList);
                  } else if (data.data.responseMessage === '데이터 없음') {
                    const item = [
                      {
                        nickName: '아직은 친구가 없습니다.',
                      },
                    ];
                    setGroupFriendList(item);
                  }
                } else {
                  console.log('그룹 유저 조회 오류: ');
                  console.log(data.statusCode);
                  console.log(data.data.responseMessage);
                }
              })
              .catch(({ error }) => {
                console.log('그룹 유저 조회 오류: ' + error);
              });

            axios_api
              .get(`friend/list/${groupidx}`)
              .then(({ data }) => {
                if (data.statusCode === 200) {
                  setGroupNotFriendList(null);
                  if (data.data.responseMessage === '친구 리스트 조회 성공') {
                    setGroupNotFriendList(data.data.friendList);
                  } else if (data.data.responseMessage === '데이터 없음') {
                    const item = [
                      {
                        nickName: '모든 친구에 그룹에 속해있습니다.',
                      },
                    ];
                    setGroupNotFriendList(item);
                  }
                } else {
                  console.log('그룹에 속하지 않은 친구 리스트 조회 오류: ');
                  console.log(data.statusCode);
                  console.log(data.data.responseMessage);
                }
              })
              .catch(({ error }) => {
                console.log(
                  '그룹에 속하지 않은 친구 리스트 조회 오류: ' + error
                );
              });
          }
        } else {
          console.log('그룹 상세보기 조회 오류: ');
          console.log(data.statusCode);
          console.log(data.data.responseMessage);
        }
      })
      .catch(({ error }) => {
        console.log('그룹 상세 보기 오류: ' + error);
      });
  }, []);

  return (
    <div id='group-Update'>
      <h2 className='m-1 text-lg font-bold text-center'> 그룹 수정 </h2>
      <div>
        <form onSubmit={GroupUpdate}>
          <p className='my-2 text-center'>✨ 그룹 프로필 ✨</p>
          <div id='group-name-div'>
            <label htmlFor='group-name'>💙 그룹 이름 : </label>
            <input
              type='text'
              id='group-name'
              className='font-bold m-0.5'
              defaultValue={currentName.current || ''}
              onChange={(e) => (currentName.current = e.target.value)}
            ></input>
          </div>
          <div id='group-tag-div'>
            {/* {groupTag.map((tagging) => {
              return (
                <input
                  type='text'
                  className='mb-2 mr-2'
                  key={tagging.tagIdx}
                  defaultValue={tagging.tag || ''}
                  onChange={(e) => {
                    updateTag(e, tagging.tagIdx);
                  }}
                ></input>
              );
            })} */}
            <p> 💙 그룹 태그 </p>
            {currentTag.current.map((tagging, idx) => {
              return (
                <p className='inline-block' key={idx}>
                  <span className='mr-1'>#</span>
                  <input
                    type='text'
                    // defaultValue={tagging.tag || ''}
                    defaultValue={tagging || ''}
                    onChange={(e) => {
                      updateTag(e, idx);
                    }}
                    className='p-0.5 mb-2 mr-2 rounded-lg w-32 bg-[#e9e9e9]'
                  ></input>
                </p>
              );
            })}
          </div>
          <div id='group-image' className='mb-2'>
            <p>💙 그룹 이미지 </p>
            <div className='flex'>
              <img
                src={groupImg}
                className='inline-block w-24 h-24 p-1 mr-3 rounded-md'
              ></img>
              <p className='my-2'>
                <input
                  type='file'
                  accept='image/*'
                  // ref={inputRef}
                  onChange={onUploadImage}
                  className='inline-block w-full text-base text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-100 file:text-violet-700 hover:file:bg-violet-200'
                />
                <button
                  type='button'
                  className='inline-block px-4 py-2 my-2 text-xs font-semibold border-0 rounded-full bg-violet-100 text-violet-500 hover:bg-violet-200'
                  onClick={onUploadBaseImage}
                >
                  기본 이미지로 선택하기
                </button>
              </p>
            </div>
          </div>
          <div>
            <p>💙 그룹 기존 친구</p>
            {groupFriendList.map((friendItem, idx) => {
              return (
                <span key={idx} className='mr-2'>
                  {friendItem.nickName}
                </span>
              );
            })}
          </div>

          <div>
            <p className='my-2 text-center'>✨ 추가 된 사용자 ✨</p>

            {includeFriend.map((friendItem, idx) => {
              return (
                <button
                  type='button'
                  key={idx}
                  onClick={() => {
                    onChangeFRemove(idx);
                  }}
                  className='items-center inline-block px-2 mx-12 my-1 rounded-lg bg-slate-100 hover:bg-blue-200'
                >
                  {friendItem.nickName}
                </button>
              );
            })}
          </div>

          <button
            type='submit'
            className='hover:bg-sky-700 bg-cyan-600 text-white px-2.5 py-1 rounded-3xl m-auto block'
          >
            수정하기
          </button>
        </form>
      </div>

      <div id='group-Friend'>
        <hr className='my-5 border-solid border-1 border-slate-800 w-80' />

        <p className='mb-0.5'>🤗 내 친구 목록 --------------------</p>

        {groupNotFriendList.map((friendItem, idx) => {
          return (
            <button
              type='button'
              key={idx}
              onClick={() => {
                addFriend(idx);
              }}
              className='items-center inline-block px-2 mx-12 my-1 rounded-lg bg-slate-100 hover:bg-blue-200'
            >
              {friendItem.nickName}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default GroupUpdate;
