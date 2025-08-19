package com.aidyn.iot.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

    @Id
    @SequenceGenerator(name = "SequenceUserId", sequenceName = "USER_SEQ", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SequenceUserId")
    private Integer id;

    @Column(nullable = false, length = 200, updatable = true)
    private String displayName;

    @Column(nullable = false, updatable = true)
    private String regEmail;

    @Builder.Default
    private LocalDateTime createdOn = LocalDateTime.now();

}
