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
