package com.aidyn.iot.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.aidyn.iot.dto.MotorStatus;
import com.aidyn.iot.exception.HomeIotException;
import com.aidyn.iot.utils.MotorConstants;
import com.google.gson.Gson;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MotorService {

	private final RestTemplate restTemplate = new RestTemplate();

	@Autowired
	Gson gson;

	public MotorStatus makeArduinoCall(String operation) {

		try {
			// Make the GET request to the Arduino device.
			String response = restTemplate.getForObject(
					MotorConstants.ARDUINO_HOST + "/" + operation,
					String.class);
			MotorStatus motorStatus = gson.fromJson(response,
					MotorStatus.class);
			log.info("Motor Status Response: {}", response);
			return motorStatus;
		} catch (Exception e) {
			log.error("Error: {}", e.getMessage());
			throw new HomeIotException("Device Unreachable",
					HttpStatus.EXPECTATION_FAILED);
		}
	}
}
