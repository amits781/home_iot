package com.aidyn.iot.controller;

import com.aidyn.iot.dto.AssistantRequestBody;
import com.aidyn.iot.service.MotorService;
import com.aidyn.iot.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NoAuthController {

    @Autowired
    MotorService service;

    @GetMapping("/checkNoAuth")
    public ResponseEntity<String> sayHello() {
        return new ResponseEntity<String>("{ \"userStatus\": \"Not Authorized\"}", HttpStatus.OK);
    }

    @PostMapping("/operate-motor")
    public ResponseEntity<Object> operateMotor(@RequestBody AssistantRequestBody motorRequest) {
        return ResponseHandler.generateResponse(HttpStatus.OK,
                service.operateMotorByAssistant(motorRequest));
    }

    @PostMapping("/motor-status")
    public ResponseEntity<Object> getMotorStatus(@RequestBody AssistantRequestBody motorRequest) {
        return ResponseHandler.generateResponse(HttpStatus.OK,
                service.getMotorStatusByAssistant(motorRequest));
    }
}
