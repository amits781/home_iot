package com.aidyn.iot.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.aidyn.iot.entity.DeviceActivity;

@Repository
public interface DeviceActivityRepository extends JpaRepository<DeviceActivity, Integer> {

  Optional<DeviceActivity> findTopByEndTimeIsNullOrderByStartTimeDesc();

  List<DeviceActivity> findAllByOrderByStartTimeDesc();
}
