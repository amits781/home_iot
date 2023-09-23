package com.aidyn.iot.service;

import java.time.LocalDateTime;
import java.util.List;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.aidyn.iot.dao.UserDao;
import com.aidyn.iot.dto.MotorStatus;
import com.aidyn.iot.entity.ArduinoDevice;
import com.aidyn.iot.entity.ArduinoDevice.DeviceStatus;
import com.aidyn.iot.entity.User;
import com.aidyn.iot.exception.HomeIotException;
import com.aidyn.iot.utils.MotorConstants;
import com.aidyn.iot.utils.Utils;
import com.google.gson.Gson;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MotorService {

	private final RestTemplate restTemplate = new RestTemplate();

	@Autowired
	Gson gson;

	@Autowired
	ArduinoDeviceService arduinoService;

	@Autowired
	EmailService emailService;

	@Autowired
	UserDao userDao;

	public MotorStatus operateMotor(String operation) {
		List<String> operationToEmail = List.of("H", "L");
		MotorStatus status = makeArduinoCall(operation);
		if (operationToEmail.contains(operation)) {
			DeviceStatus deviceStatus = operation.equalsIgnoreCase("H") ? DeviceStatus.ON : DeviceStatus.OFF;
			ArduinoDevice device = arduinoService.getDevice();
			device.setDeviceStatus(deviceStatus);
			device.setOperatedBy(Utils.getCurrentUser().getDisplayName());
			device.setUpdatedOn(LocalDateTime.now());
			arduinoService.saveDevice(device);
			sendEmailToAllUser(device);
		} 
		return status;
	}

	public void sendEmailToAllUser(ArduinoDevice device) {
		List<User> users = userDao.getAllUser();
		String emailMessage = String.format(MotorConstants.EMAIL_MESSAGE, "Motor", device.getDeviceStatus().name(),
				device.getUpdatedOn(), device.getOperatedBy());
		users.forEach(user -> {
			try {
				emailService.sendEmail(user.getRegEmail(), MotorConstants.EMAIL_SUBJECT, emailMessage);
				log.info("email sent to : {}", user.getDisplayName());
			} catch (MessagingException e) {
				log.error("Email to {} send failed: {}", user.getDisplayName(), e.getMessage());
			}
		});

	}

	public MotorStatus makeArduinoCall(String operation) {

		try {
			// Make the GET request to the Arduino device.
			String response = restTemplate.getForObject(MotorConstants.ARDUINO_HOST + "/" + operation, String.class);
			MotorStatus motorStatus = gson.fromJson(response, MotorStatus.class);
			log.info("Motor Status Response: {}", response);
			return motorStatus;
		} catch (Exception e) {
			log.error("Error: {}", e.getMessage());
			throw new HomeIotException("Device Unreachable", HttpStatus.EXPECTATION_FAILED);
		}
	}

	public MotorStatus getDeviceStatus() {
		try {
			// Create a RestTemplate with a timeout configuration.
			int timeout = 5000; // Timeout in milliseconds (adjust as needed)
			SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
			factory.setConnectTimeout(timeout);
			factory.setReadTimeout(timeout);

			RestTemplate restTemplate = new RestTemplate(factory);

			// Make the GET request to the Arduino device.
			String response = restTemplate.getForObject(MotorConstants.ARDUINO_HOST + "/S", String.class);

			MotorStatus motorStatus = gson.fromJson(response, MotorStatus.class);
			log.info("Motor Status Response: {}", response);
			return motorStatus;
		} catch (Exception e) {
			log.error("Error getting device status: {}", e.getMessage());
			return MotorStatus.builder().status(2).build();
		}

	}
}
