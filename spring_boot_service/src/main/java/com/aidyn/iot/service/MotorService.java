package com.aidyn.iot.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import javax.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

  @Autowired
  RestTemplate restTemplate;

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
      DeviceStatus deviceStatus =
          operation.equalsIgnoreCase("H") ? DeviceStatus.ON : DeviceStatus.OFF;
      ArduinoDevice device = arduinoService.getDevice();
      device.setDeviceStatus(deviceStatus);
      device.setOperatedBy(Utils.getCurrentUser().getDisplayName());
      device.setUpdatedOn(LocalDateTime.now());
      arduinoService.saveDevice(device);
      sendEmailToAllUserAsync(device, MotorConstants.DEVICE_TYPE_MOTOR);
    }
    return status;
  }

  public MotorStatus getMotorStatus() {
    ArduinoDevice device = arduinoService.getDevice();
    Integer status = Integer.parseInt(device.getDeviceStatus().getValue());
    return MotorStatus.builder().status(status).build();
  }

  public void sendEmailToAllUser(ArduinoDevice device, String targetDevice) {
    List<User> users = userDao.getAllUser();
    String deviceStatusString = getDeviceStatusString(device, targetDevice);
    deviceStatusString = deviceStatusString.toLowerCase();
    String emailMessage = String.format(MotorConstants.EMAIL_MESSAGE, targetDevice,
        deviceStatusString, Utils.getFormatedDate(device.getUpdatedOn()), device.getOperatedBy());
    users.forEach(user -> {
      try {
        emailService.sendEmail(user.getRegEmail(), MotorConstants.EMAIL_SUBJECT, emailMessage);
        log.info("email sent to : {}", user.getDisplayName());
      } catch (MessagingException e) {
        log.error("Email to {} send failed: {}", user.getDisplayName(), e.getMessage());
      }
    });

  }

  public CompletableFuture<Void> sendEmailToAllUserAsync(ArduinoDevice device,
      String targetDevice) {
    List<User> users = userDao.getAllUser();
    String deviceStatusString = getDeviceStatusString(device, targetDevice);
    deviceStatusString = deviceStatusString.toLowerCase();
    String emailMessage = String.format(MotorConstants.EMAIL_MESSAGE, targetDevice,
        deviceStatusString, Utils.getFormatedDate(device.getUpdatedOn()), device.getOperatedBy());

    // Create a CompletableFuture that is initially completed
    CompletableFuture<Void> allEmailsSent = CompletableFuture.completedFuture(null);

    for (User user : users) {
      final String userEmail = user.getRegEmail();
      final String userName = user.getDisplayName();

      // For each user, chain the email sending task
      allEmailsSent = allEmailsSent.thenRunAsync(() -> {
        try {
          emailService.sendEmail(userEmail, MotorConstants.EMAIL_SUBJECT, emailMessage);
          log.info("email sent to : {}", userName);
        } catch (MessagingException e) {
          log.error("Email to {} send failed: {}", userName, e.getMessage());
        }
      });
    }

    return allEmailsSent;
  }

  private String getDeviceStatusString(ArduinoDevice device, String targetDevice) {
    return targetDevice.equals(MotorConstants.DEVICE_TYPE_MOTOR) ? device.getDeviceStatus().name()
        : device.getDeviceStatus().equals(DeviceStatus.ERROR) ? DeviceStatus.OFF.name()
            : DeviceStatus.ON.name();
  }

  public MotorStatus makeArduinoCall(String operation) {

    try {
      // Make the GET request to the Arduino device.
      String response =
          restTemplate.getForObject(MotorConstants.ARDUINO_HOST + "/" + operation, String.class);
      MotorStatus motorStatus = gson.fromJson(response, MotorStatus.class);
      log.info("Motor Status Response: {}", response);
      return motorStatus;
    } catch (Exception e) {
      log.error("Error: {}", e.getMessage());
      throw new HomeIotException("Device Unreachable", HttpStatus.EXPECTATION_FAILED);
    }
  }

  public MotorStatus getDeviceStatus() {
    int retryCount = 0;
    int maxRetry = 2;
    while (retryCount < maxRetry) {
      try {
        String response = restTemplate.getForObject(
            MotorConstants.ARDUINO_HOST + "/" + MotorConstants.STATUS_API, String.class);
        MotorStatus motorStatus = gson.fromJson(response, MotorStatus.class);
        return motorStatus;
      } catch (Exception e) {
        retryCount++;
        if (retryCount == maxRetry) {
          if (!e.getCause().getClass().getName()
              .equalsIgnoreCase("java.net.SocketTimeoutException")) {
            log.error("Error occured in scheduler get device status: {}", e.getMessage());
            log.info("classname: {}", e.getCause().getClass().getName());
          }
        }
      }
    }
    return MotorStatus.builder().status(2).build();
  }
}
