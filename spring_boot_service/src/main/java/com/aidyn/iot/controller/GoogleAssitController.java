package com.aidyn.iot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.aidyn.iot.annotation.RequiresOperateRole;
import com.aidyn.iot.annotation.ScopeValidator;
import com.aidyn.iot.service.MotorService;
import com.aidyn.iot.utils.MotorConstants;
import com.aidyn.iot.utils.ResponseHandler;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class GoogleAssitController {

	@Autowired
	MotorService service;

	@GetMapping("/webhook")
	public void acceptWebHook(@RequestBody String request) {
		log.info("webhook request received:{}",request);
	}
	
	@PostMapping("/webhook")
	public void acceptPostWebHook(@RequestBody String request) {
		log.info("webhook request received:{}",request);
	}
}
