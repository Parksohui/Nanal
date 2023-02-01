package com.dbd.nanal.service;

import com.dbd.nanal.dto.FriendDetailResponseDTO;
import com.dbd.nanal.model.DiaryEntity;
import com.dbd.nanal.model.FriendEntity;
import com.dbd.nanal.model.UserEntity;
import com.dbd.nanal.model.UserProfileEntity;
import com.dbd.nanal.repository.DiaryRepository;
import com.dbd.nanal.repository.FriendRepository;
import com.dbd.nanal.repository.UserProfileRepository;
import com.dbd.nanal.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class FriendService {

    private final FriendRepository friendRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final DiaryRepository diaryRepository;

    public FriendService(FriendRepository friendRepository, UserRepository userRepository, UserProfileRepository userProfileRepository, DiaryRepository diaryRepository) {
        this.friendRepository = friendRepository;
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.diaryRepository = diaryRepository;
    }

    // 친구 등록
    @Transactional
    public boolean save(HashMap<String, Integer> map) {

        UserEntity user = userRepository.findByUserIdx(map.get("userIdx"));
        UserEntity friend = userRepository.findByUserIdx(map.get("friendIdx"));

        friendRepository.save(FriendEntity.builder().user_idx1(user).user_idx2(friend).build());
        friendRepository.save(FriendEntity.builder().user_idx1(friend).user_idx2(user).build());

        return true;
    }

    // 친구 리스트
    public List<FriendDetailResponseDTO> findFriendList(int userIdx) {

        List<FriendEntity> friends = friendRepository.findAllFriends(userIdx);

        List<FriendDetailResponseDTO> friendDetailResponseDTOS = new ArrayList<>();
        for (FriendEntity friend : friends) {

            DiaryEntity diary = diaryRepository.findLatestDiary(friend.getUser_idx2().getUserIdx());
            // 일기 하나도 없을 때
            if (diary == null) {
                friendDetailResponseDTOS.add(new FriendDetailResponseDTO(friend.getUser_idx2().getUserProfile(), friend.getUser_idx2().getUserIdx(), ""));
            }
            else {
                friendDetailResponseDTOS.add(new FriendDetailResponseDTO(friend.getUser_idx2().getUserProfile(), friend.getUser_idx2().getUserIdx(), diary.getContent()));
            }
        }
        return friendDetailResponseDTOS;
    }


    // 친구 조회
    public FriendDetailResponseDTO findFriend(int userIdx) {

        UserProfileEntity userProfile = userProfileRepository.findFriend(userIdx);
        return new FriendDetailResponseDTO(userProfile, userIdx);


    }
}
