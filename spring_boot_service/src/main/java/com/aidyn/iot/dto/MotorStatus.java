package com.aidyn.iot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * This is a DTO class to contain device status. Fields are status and strength
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class MotorStatus {
  Integer status;
  Integer strength;
}
