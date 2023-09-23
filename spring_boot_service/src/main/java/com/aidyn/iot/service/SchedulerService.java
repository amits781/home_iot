package com.aidyn.iot.service;

import java.time.LocalDateTime;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.aidyn.iot.dto.MotorStatus;
import com.aidyn.iot.entity.ArduinoDevice;
import com.aidyn.iot.entity.ArduinoDevice.DeviceStatus;
import com.aidyn.iot.exception.NotFoundException;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SchedulerService {

	@Autowired
	ArduinoDeviceService arduinoService;

	@Autowired
	MotorService motorService;


	@PostConstruct
	public void initArduinoDevice() {
		log.info("Initial Device check");
		try {
			arduinoService.getDevice();
			log.info("Initial Device Found.");
		} catch (NotFoundException e) {
			log.info("Initial Device Not Found.");
			ArduinoDevice device = ArduinoDevice.builder().deviceStatus(DeviceStatus.OFF).build();
			arduinoService.saveDevice(device);
		} catch (Exception e) {
			log.error("Initial device check failed: {}", e.getMessage());
		}
	}

	@Scheduled(fixedRate = 5000) // Run every 5 seconds
	public void runScheduledTask() {
		MotorStatus motorStatus = motorService.getDeviceStatus();
		ArduinoDevice.DeviceStatus currentStatus = getDeviceStatus(motorStatus);
		ArduinoDevice device = arduinoService.getDevice();
		if (!device.getDeviceStatus().equals(currentStatus)) {
			log.info("Device status changed from {} to {}", device.getDeviceStatus().getValue(),
					currentStatus.getValue());
			device.setDeviceStatus(currentStatus);
			device.setUpdatedOn(LocalDateTime.now());
			device.setOperatedBy("SYSTEM");
			device = arduinoService.saveDevice(device);
			motorService.sendEmailToAllUser(device);
		}
	}

	private DeviceStatus getDeviceStatus(MotorStatus motorStatus) {
		return DeviceStatus.findByValue(motorStatus.getStatus().toString());
	}
}
