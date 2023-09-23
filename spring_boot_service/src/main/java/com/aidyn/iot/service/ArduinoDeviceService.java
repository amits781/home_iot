package com.aidyn.iot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.aidyn.iot.dao.ArduinoDao;
import com.aidyn.iot.entity.ArduinoDevice;
import com.aidyn.iot.exception.NotFoundException;

@Service
public class ArduinoDeviceService {

  @Autowired
  private ArduinoDao dao;

  public static final String DEVICE_NOT_FOUND_BY_ID = "Device with Id: %s not found.";

  public ArduinoDevice getDevice() {
    return dao.getDevice(1)
        .orElseThrow(() -> new NotFoundException(String.format(DEVICE_NOT_FOUND_BY_ID, 1)));
  }

  public ArduinoDevice saveDevice(ArduinoDevice device) {
    return dao.saveDevice(device);
  }
}
