package com.dbd.nanal.repository;

import com.dbd.nanal.model.UserEntity;
import com.dbd.nanal.model.UserProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfileEntity, Long> {

    UserProfileEntity findByUser(UserEntity user);
    UserProfileEntity findByNickname(String nickname);
    Boolean existsByNickname(String nickname);



}
