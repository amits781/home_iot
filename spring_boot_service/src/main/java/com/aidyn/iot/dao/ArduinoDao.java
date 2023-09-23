package com.aidyn.iot.dao;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.aidyn.iot.entity.ArduinoDevice;
import com.aidyn.iot.repository.ArduinoRepo;

@Component
public class ArduinoDao {

  @Autowired
  ArduinoRepo repository;

  public ArduinoDevice saveDevice(ArduinoDevice device) {
    return repository.save(device);
  }

  public Optional<ArduinoDevice> getDevice(Integer deviceId) {
    return repository.findById(deviceId);
  }
}
