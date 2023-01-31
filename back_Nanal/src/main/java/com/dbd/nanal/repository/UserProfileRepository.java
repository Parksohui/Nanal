package com.dbd.nanal.repository;

import com.dbd.nanal.model.UserProfileEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfileEntity, Integer> {

    UserProfileEntity findByProfileId(int profileId);
    Boolean existsByNickname(String nickname);

    @Query("select p from UserProfileEntity p where p.user.userIdx = :userIdx")
    UserProfileEntity findFriend(@Param("userIdx") int userIdx);
}
