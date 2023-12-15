package com.aidyn.iot.entity;

import java.time.LocalDateTime;
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
public class DeviceActivity {

  @Id
  @SequenceGenerator(name = "SequenceActivityId", sequenceName = "ACTIVITY_SEQ", allocationSize = 1)
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SequenceActivityId")
  private Integer id;

  private String startByOperator;

  private String endByOperator;

  private LocalDateTime startTime;

  private LocalDateTime endTime;

  private Long duration;

}
