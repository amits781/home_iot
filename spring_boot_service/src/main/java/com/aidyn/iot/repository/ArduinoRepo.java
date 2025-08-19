package com.aidyn.iot.repository;

import com.aidyn.iot.entity.ArduinoDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArduinoRepo extends JpaRepository<ArduinoDevice, Integer> {

}
