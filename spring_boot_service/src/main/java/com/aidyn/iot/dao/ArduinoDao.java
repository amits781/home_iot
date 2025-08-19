package com.aidyn.iot.dao;

import com.aidyn.iot.entity.ArduinoDevice;
import com.aidyn.iot.repository.ArduinoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

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
