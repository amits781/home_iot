package com.aidyn.iot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aidyn.iot.annotation.RequiresOperateRole;
import com.aidyn.iot.annotation.ScopeValidator;
import com.aidyn.iot.service.MotorService;
import com.aidyn.iot.utils.MotorConstants;
import com.aidyn.iot.utils.ResponseHandler;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@ScopeValidator(roles = "operate", organization = "org_2VCGpyCsoZFYn7ePa2FiNl0bAka")
public class MainController {

	@Autowired
	MotorService service;

	@GetMapping("/checkAuth")
	public ResponseEntity<String> sayHello() {
		return new ResponseEntity<String>(
				"{ \"userStatus\": \"Authorized\"}", HttpStatus.OK);
	}

	@GetMapping("/motorOn")
	public ResponseEntity<Object> turnOnMotor() {
		log.info("Motor on requested");
		return ResponseHandler.generateResponse(HttpStatus.OK,
				service.makeArduinoCall(MotorConstants.TURN_ON_API));
	}

	@GetMapping("/motorOff")
	public ResponseEntity<Object> turnOffMotor() {
		log.info("Motor off requested");
		return ResponseHandler.generateResponse(HttpStatus.OK,
				service.makeArduinoCall(MotorConstants.TURN_OFF_API));
	}

	@GetMapping("/motorStatus")
	public ResponseEntity<Object> getMotorStatus() {
		log.info("Motor status requested");
		return ResponseHandler.generateResponse(HttpStatus.OK,
				service.makeArduinoCall(MotorConstants.STATUS_API));
	}
}