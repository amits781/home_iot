package com.aidyn.iot.entity;

import com.aidyn.iot.exception.NotFoundException;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ArduinoDevice {

    @Id
    @SequenceGenerator(name = "SequenceDeviceId", sequenceName = "ARDUINO_SEQ", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SequenceDeviceId")
    private Integer id;

    @Enumerated(EnumType.STRING)
    private DeviceStatus deviceStatus;

    @Builder.Default
    private LocalDateTime updatedOn = LocalDateTime.now();

    private String operatedBy;

    private Integer strength;

    public enum DeviceStatus {
        ON("1"), OFF("0"), ERROR("2");

        private final String value;

        DeviceStatus(String value) {
            this.value = value;
        }

        public static DeviceStatus findByValue(String value) {
            for (DeviceStatus deviceStatus : DeviceStatus.values()) {
                if (deviceStatus.getValue().equals(value)) {
                    return deviceStatus;
                }
            }
            throw new NotFoundException("The given value for DeviceStatus dose not exists:" + value);
        }

        public String getValue() {
            return value;
        }

        public Integer getIntValue() {
            return Integer.parseInt(value);
        }
    }

}
