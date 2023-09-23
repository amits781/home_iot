package com.aidyn.iot.entity;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
