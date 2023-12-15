package com.aidyn.iot.scheduler;

import java.time.LocalDateTime;
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.aidyn.iot.dto.MotorStatus;
import com.aidyn.iot.entity.ArduinoDevice;
import com.aidyn.iot.entity.ArduinoDevice.DeviceStatus;
import com.aidyn.iot.exception.NotFoundException;
import com.aidyn.iot.service.ArduinoDeviceService;
import com.aidyn.iot.service.MotorService;
import com.aidyn.iot.utils.MotorConstants;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SchedulerService {

  @Autowired
  ArduinoDeviceService arduinoService;

  @Autowired
  MotorService motorService;

  @Value("${SCHEDULER_ENABLED:true}")
  private Boolean isSchedulerEnabled;

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

  @Scheduled(fixedRate = 10000) // Run every 10 seconds
  public void runScheduledTask() {
    if (isSchedulerEnabled) {
      MotorStatus motorStatus = motorService.getDeviceStatus();
      ArduinoDevice.DeviceStatus currentStatus = getDeviceStatus(motorStatus);
      ArduinoDevice device = arduinoService.getDevice();
      if (!device.getDeviceStatus().equals(currentStatus)) {
        log.info("Device status changed from {} to {}", device.getDeviceStatus().getValue(),
            currentStatus.getValue());
        String deviceType = getDeviceTypeString(currentStatus, device);
        device.setDeviceStatus(currentStatus);
        device.setUpdatedOn(LocalDateTime.now());
        device.setOperatedBy(MotorConstants.OPERATER_TYPE_SYSTEM);
        device.setStrength(motorStatus.getStrength());
        device = arduinoService.saveDevice(device);
        motorService.sendEmailToAllUser(device, deviceType);
      } else {
        device.setStrength(motorStatus.getStrength());
        device = arduinoService.saveDevice(device);
      }
    } else {
      log.info("Scheduler Turned off.");
    }
  }

  private String getDeviceTypeString(ArduinoDevice.DeviceStatus currentStatus,
      ArduinoDevice device) {
    return (currentStatus.equals(DeviceStatus.ERROR)
        || device.getDeviceStatus().equals(DeviceStatus.ERROR)) ? MotorConstants.DEVICE_TYPE_POWER
            : MotorConstants.DEVICE_TYPE_MOTOR;
  }

  private DeviceStatus getDeviceStatus(MotorStatus motorStatus) {
    return DeviceStatus.findByValue(motorStatus.getStatus().toString());
  }
}
