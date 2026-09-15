package com.aidyn.iot.dao;

import com.aidyn.iot.entity.DeviceActivity;
import com.aidyn.iot.repository.DeviceActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

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

    public Page<DeviceActivity> getActivities(LocalDateTime start, LocalDateTime end, Pageable pageable) {
        return repository.findByDateRange(start, end, pageable);
    }

    public long getTotalDurationSeconds(LocalDateTime start, LocalDateTime end) {
        return repository.sumDurationByDateRange(start, end);
    }
}
