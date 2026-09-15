package com.aidyn.iot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TotalConsumptionResponse {

    private double totalConsumption;

    private long totalDurationSeconds;
}
