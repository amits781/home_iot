package com.aidyn.iot.controller;

import com.aidyn.iot.annotation.ScopeValidator;
import com.aidyn.iot.service.MotorService;
import com.aidyn.iot.utils.MotorConstants;
import com.aidyn.iot.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@ScopeValidator(roles = "operate", organization = "org_2VCGpyCsoZFYn7ePa2FiNl0bAka")
public class MainController {

    @Autowired
    MotorService service;

    @GetMapping("/checkAuth")
    public ResponseEntity<String> sayHello() {
        return new ResponseEntity<String>("{ \"userStatus\": \"Authorized\"}", HttpStatus.OK);
    }

    @GetMapping("/motorOn")
    public ResponseEntity<Object> turnOnMotor() {
        return ResponseHandler.generateResponse(HttpStatus.OK,
                service.operateMotor(MotorConstants.TURN_ON_API));
    }

    @GetMapping("/motorOff")
    public ResponseEntity<Object> turnOffMotor() {
        return ResponseHandler.generateResponse(HttpStatus.OK,
                service.operateMotor(MotorConstants.TURN_OFF_API));
    }

    @GetMapping("/motorStatus")
    public ResponseEntity<Object> getMotorStatus() {
        return ResponseHandler.generateResponse(HttpStatus.OK, service.getMotorStatus());
    }

    @GetMapping("/activities")
    public ResponseEntity<Object> getAllDeviceActivities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseHandler.generateResponse(HttpStatus.OK,
                service.getAllDeviceActivities(page, size, from, to));
    }

    @GetMapping("/activities/totalConsumption")
    public ResponseEntity<Object> getTotalConsumption(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseHandler.generateResponse(HttpStatus.OK, service.getTotalConsumption(from, to));
    }
}
