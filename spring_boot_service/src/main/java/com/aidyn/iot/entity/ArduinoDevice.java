package com.aidyn.iot.entity;

import java.time.LocalDateTime;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import com.aidyn.iot.exception.NotFoundException;
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

    public String getValue() {
      return value;
    }

    public static DeviceStatus findByValue(String value) {
      for (DeviceStatus deviceStatus : DeviceStatus.values()) {
        if (deviceStatus.getValue().equals(value)) {
          return deviceStatus;
        }
      }
      throw new NotFoundException("The given value for DeviceStatus dose not exists:" + value);
    }
  }

}
