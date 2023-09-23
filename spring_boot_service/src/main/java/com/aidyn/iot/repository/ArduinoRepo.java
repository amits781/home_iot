package com.aidyn.iot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aidyn.iot.entity.ArduinoDevice;

@Repository
public interface ArduinoRepo extends JpaRepository<ArduinoDevice, Integer>{

}
