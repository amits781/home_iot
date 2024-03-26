package com.aidyn.iot.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Semaphore;
import javax.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.aidyn.iot.dao.DeviceActivityDao;
import com.aidyn.iot.dao.UserDao;
import com.aidyn.iot.dto.AssistantRequestBody;
import com.aidyn.iot.dto.MotorStatus;
import com.aidyn.iot.entity.ArduinoDevice;
import com.aidyn.iot.entity.ArduinoDevice.DeviceStatus;
import com.aidyn.iot.entity.DeviceActivity;
import com.aidyn.iot.entity.User;
import com.aidyn.iot.exception.HomeIotException;
import com.aidyn.iot.utils.MotorConstants;
import com.aidyn.iot.utils.Utils;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MotorService {

  private static final Semaphore semaphore = new Semaphore(1, true);

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

  @Autowired
  DeviceActivityDao deviceActivityDao;

  @Value("${SECRET_KEY}")
  private String assistantSecret;

  /**
   * Send the required operation to arduino device (H/L)
   * 
   * @param operation - Current requested operation
   * @return status of motor along with it's wifi strength
   */
  public MotorStatus operateMotor(String operation) {
    Object httpAttribute = Utils.getCurrentUser();
    User currUser = null;
    if (httpAttribute instanceof User) {
      currUser = (User) httpAttribute;
    } else {
      currUser = userDao.getUserByEmail(MotorConstants.ASSISTANT_EMAIL).orElseThrow(
          () -> new HomeIotException("Assistant User not found", HttpStatus.EXPECTATION_FAILED));
    }
    log.info("Operation {} initiated for user {}.", operation, currUser.getDisplayName());
    ArduinoDevice dbDevice = arduinoService.getDevice();
    DeviceStatus dbDeviceStatus = dbDevice.getDeviceStatus();
    DeviceStatus newDeviceStatus =
        operation.equalsIgnoreCase("H") ? DeviceStatus.ON : DeviceStatus.OFF;
    MotorStatus status;
    if (dbDeviceStatus.equals(newDeviceStatus)) {
      status = MotorStatus.builder().status(dbDeviceStatus.getIntValue())
          .strength(dbDevice.getStrength()).build();
      return status;
    }
    List<String> operationToEmail = List.of("H", "L");
    status = makeArduinoCall(operation);
    log.info("Operation {} response from arduino {}.", operation, status);
    if (operationToEmail.contains(operation)) {

      dbDevice.setDeviceStatus(newDeviceStatus);
      dbDevice.setOperatedBy(currUser.getDisplayName());
      dbDevice.setUpdatedOn(LocalDateTime.now());
      arduinoService.saveDevice(dbDevice);
      sendEmailToAllUserAsync(dbDevice, MotorConstants.DEVICE_TYPE_MOTOR);
    }
    return status;
  }

  /**
   * New method to support calls from Smart assistant device.
   * 
   * @param motorRequest - Current requested operation
   * @return status of motor along with it's wifi strength
   */
  public MotorStatus operateMotorByAssistant(AssistantRequestBody motorRequest) {
    log.info("Request received for assistant user: {}", motorRequest.getOperation());
    if (!assistantSecret.equals(motorRequest.getSecret())) {
      // Only when secret matches, the operation is allowed
      throw new HomeIotException("Assistant User not authorised", HttpStatus.UNAUTHORIZED);
    }
    // To make it compatible with "operateMotor" method
    // Not much of logic here
    Utils.setAssistantUser();
    String operation =
        motorRequest.getOperation().equalsIgnoreCase("On") ? MotorConstants.TURN_ON_API
            : MotorConstants.TURN_OFF_API;
    return operateMotor(operation);
  }

  /**
   * Gives the status of the DB device entry. This is to fulfill request from UI for status query
   * 
   * @return Motor status
   */
  public MotorStatus getMotorStatus() {
    Object httpAttribute = Utils.getCurrentUser();
    User currUser = null;
    if (httpAttribute instanceof User) {
      currUser = (User) httpAttribute;
    } else {
      currUser = userDao.getUserByEmail(MotorConstants.ASSISTANT_EMAIL).orElseThrow(
          () -> new HomeIotException("Assistant User not found", HttpStatus.EXPECTATION_FAILED));
    }
    log.info("Operation get status initiated for user {}.", currUser.getDisplayName());
    ArduinoDevice device = arduinoService.getDevice();
    Integer status = device.getDeviceStatus().getIntValue();
    MotorStatus motorStatus =
        MotorStatus.builder().status(status).strength(device.getStrength()).build();
    log.info("Operation get status response from db {}.", motorStatus);
    return motorStatus;
  }

  public MotorStatus getMotorStatusByAssistant(AssistantRequestBody motorRequest) {
    log.info("Operation get status initiated for assistant");
    if (!assistantSecret.equals(motorRequest.getSecret())) {
      // Only when secret matches, the operation is allowed
      throw new HomeIotException("Assistant User not authorised", HttpStatus.UNAUTHORIZED);
    }
    // To make it compatible with "operateMotor" method
    // Not much of logic here
    Utils.setAssistantUser();
    return getMotorStatus();
  }

  /**
   * Only used by scheduler service. Sends email whenever power goes off or comes back. Since it
   * works inside the server, we don't really care about response time/ gateway time out
   * 
   * @param device
   * @param targetDevice
   */
  public void sendEmailToAllUser(ArduinoDevice device, String targetDevice) {
    createActivity(device);
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

  /**
   * To send email notifications to users in house Also creates the device activity history
   * 
   * @param device - DB device object
   * @param targetDevice - Maybe either Motor/Power depending on operation
   * @return never mind
   */
  public CompletableFuture<Void> sendEmailToAllUserAsync(ArduinoDevice device,
      String targetDevice) {
    createActivity(device);
    List<User> users = userDao.getAllUser();
    String deviceStatusString = getDeviceStatusString(device, targetDevice);
    deviceStatusString = deviceStatusString.toLowerCase();
    String emailMessage = String.format(MotorConstants.EMAIL_MESSAGE, targetDevice,
        deviceStatusString, Utils.getFormatedDate(device.getUpdatedOn()), device.getOperatedBy());

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


  /**
   * To log every activity done by user in activity page. Specifying the start time , end time,
   * start by, end by operations
   * 
   * @param device - The device on which operation was performed
   */
  private void createActivity(ArduinoDevice device) {
    DeviceActivity deviceActivity = DeviceActivity.builder().build();
    if (Objects.equals(device.getDeviceStatus(), ArduinoDevice.DeviceStatus.ON)) {
      deviceActivity.setStartByOperator(device.getOperatedBy());
      deviceActivity.setStartTime(device.getUpdatedOn());
    } else if (Objects.equals(device.getDeviceStatus(), ArduinoDevice.DeviceStatus.OFF)
        || Objects.equals(device.getDeviceStatus(), ArduinoDevice.DeviceStatus.ERROR)) {
      // Case where device was turned off or power went off
      Optional<DeviceActivity> optionalActivity = deviceActivityDao.getMostRecentDeviceActivity();
      if (optionalActivity.isPresent()) {
        // Only make and entry if motor on entry was found
        deviceActivity = optionalActivity.get();
        deviceActivity.setEndByOperator(device.getOperatedBy());
        deviceActivity.setEndTime(device.getUpdatedOn());
        deviceActivity.setDuration(
            Utils.getDurationInSeconds(deviceActivity.getStartTime(), device.getUpdatedOn()));
      } else {
        if (Objects.equals(device.getOperatedBy(), MotorConstants.OPERATER_TYPE_SYSTEM)) {
          // we don't want to log system generated events like power on or off
          return;
        }
        /*
         * Corner case where we get motor off request without any prior motor on events Here it
         * handles them by creating start time and end time same As well as start by and ended by is
         * same
         */
        deviceActivity.setStartByOperator(device.getOperatedBy());
        deviceActivity.setStartTime(device.getUpdatedOn());
        deviceActivity.setEndByOperator(device.getOperatedBy());
        deviceActivity.setEndTime(device.getUpdatedOn());
        deviceActivity
            .setDuration(Utils.getDurationInSeconds(device.getUpdatedOn(), device.getUpdatedOn()));
      }
    }
    deviceActivityDao.saveDeviceActivity(deviceActivity);
  }

  private String getDeviceStatusString(ArduinoDevice device, String targetDevice) {
    return targetDevice.equals(MotorConstants.DEVICE_TYPE_MOTOR) ? device.getDeviceStatus().name()
        : device.getDeviceStatus().equals(DeviceStatus.ERROR) ? DeviceStatus.OFF.name()
            : DeviceStatus.ON.name();
  }

  /**
   * Function to make calls to arduino device. It limits single call to device with semaphore
   * variables. So at any point of time only a single call to device will be made, reducing socket
   * exception
   * 
   * @param operation
   * @return Motor status
   */
  public MotorStatus makeArduinoCall(String operation) {

    try {
      semaphore.acquire();
      // Make the GET request to the Arduino device.
      String response =
          restTemplate.getForObject(MotorConstants.ARDUINO_HOST + "/" + operation, String.class);
      MotorStatus motorStatus = gson.fromJson(response, MotorStatus.class);
      return motorStatus;
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      log.error("Thread interupted: {}", e.getCause().getMessage());
    } catch (Exception e) {
      log.error("Error: {}", e.getMessage());
    } finally {
      semaphore.release(); // Release the permit
    }
    throw new HomeIotException("Device Unreachable", HttpStatus.EXPECTATION_FAILED);
  }

  /**
   * Used by scheduler service to get updated device status everytime. Function to make calls to
   * arduino device. It limits single call to device with semaphore variables. So at any point of
   * time only a single call to device will be made, reducing socket exception
   * 
   * This function also makes max of 3 tries if failures happens at an interval of 2sec.
   * 
   * @return Motor status
   */
  public MotorStatus getDeviceStatus() {
    int retryCount = 0;
    int maxRetry = 2;
    while (retryCount <= maxRetry) {
      try {
        semaphore.acquire();
        String response = restTemplate.getForObject(
            MotorConstants.ARDUINO_HOST + "/" + MotorConstants.STATUS_API, String.class);
        MotorStatus motorStatus = gson.fromJson(response, MotorStatus.class);
        // log.info("Motor Status: {}", motorStatus);
        return motorStatus;
      } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
        log.error("Thread interupted: {}", e.getCause().getMessage());
      } catch (Exception e) {
        if (retryCount >= maxRetry) {
          // if (!e.getCause().getClass().getName()
          // .equalsIgnoreCase("java.net.SocketTimeoutException")) {
          log.error("Error occured in scheduler get device status: {}", e.getMessage());
          log.info("classname: {}", e.getCause().getClass().getName());
          log.info("Max retry reached : {}", retryCount);
          // }
        } else {
          try {
            log.info("Retry count : {}", retryCount);
            log.info("Sleeping for 2 secs");
            Thread.sleep(2000);
            log.info("Retrying after sleep");
          } catch (InterruptedException e1) {
            log.info("Exception occured in thread sleep: {}", e1.getCause());
            e1.printStackTrace();
          }
        }
      } finally {
        semaphore.release(); // Release the permit
        retryCount++;
      }
    }
    return MotorStatus.builder().status(2).build();
  }

  public List<DeviceActivity> getAllDeviceActivities() {
    return deviceActivityDao.getAllActivity();
  }
}
