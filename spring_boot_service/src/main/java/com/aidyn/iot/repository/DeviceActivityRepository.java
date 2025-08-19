package com.aidyn.iot.repository;

import com.aidyn.iot.entity.DeviceActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceActivityRepository extends JpaRepository<DeviceActivity, Integer> {

    Optional<DeviceActivity> findTopByEndTimeIsNullOrderByStartTimeDesc();

    List<DeviceActivity> findAllByOrderByStartTimeDesc();
}
