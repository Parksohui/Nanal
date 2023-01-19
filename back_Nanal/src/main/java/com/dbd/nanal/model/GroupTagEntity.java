package com.dbd.nanal.model;


import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "group_tag")
@Getter
@NoArgsConstructor
public class GroupTagEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)// auto_increment
    @Column(name = "tag_idx")
    private int tagIdx;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_idx")
    private GroupMemberEntity groupMember;

    @Column
    private String tag;

    @Builder
    public GroupTagEntity(int tagIdx, GroupMemberEntity groupMember, String tag) {
        this.tagIdx = tagIdx;
        this.groupMember = groupMember;
        this.tag = tag;
    }

}
