package com.dbd.nanal.model;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@NoArgsConstructor
@Entity
@Table(name="notice")
public class NoticeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="notice_idx", columnDefinition = "INT UNSIGNED")
    private int noticeIdx;

    @ManyToOne(fetch =FetchType.LAZY)
    @JoinColumn(name="user_idx")
    private UserEntity user;

    @Column(name="request_user_idx")
    private int requestUserIdx;

    @Column(name="request_group_idx")
    private int requestGroupIdx;

    @Column(name="notice_type")
    private int noticeType;

    private String content;

    @Column(name="is_checked")
    private Boolean isChecked;

    @CreationTimestamp
    @Column(name="creation_date")
    private Timestamp creationDate;

    @Column(name="expire_date")
    private Timestamp expireDate;

    @Builder
    public NoticeEntity(int noticeIdx, int requestUserIdx, int requestGroupIdx, UserEntity user, int noticeType, String content, Boolean isChecked, Timestamp creationDate, Timestamp expireDate) {
        this.noticeIdx=noticeIdx;
        this.requestGroupIdx=requestGroupIdx;
        this.requestUserIdx=requestUserIdx;
        this.user=user;
        this.noticeType=noticeType;
        this.content=content;
        this.isChecked=isChecked;
        this.creationDate=creationDate;
        this.expireDate=expireDate;
    }
}