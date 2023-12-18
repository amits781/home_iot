package com.aidyn.iot.dao;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.aidyn.iot.entity.DeviceActivity;
import com.aidyn.iot.repository.DeviceActivityRepository;

@Component
public class DeviceActivityDao {

  @Autowired
  DeviceActivityRepository repository;


  public Optional<DeviceActivity> getMostRecentDeviceActivity() {
    return repository.findTopByEndTimeIsNullOrderByStartTimeDesc();
  }

  public DeviceActivity saveDeviceActivity(DeviceActivity entity) {
    return repository.save(entity);
  }

  public List<DeviceActivity> getAllActivity() {
    return repository.findAllOrderByStartTimeDesc();
  }
}
