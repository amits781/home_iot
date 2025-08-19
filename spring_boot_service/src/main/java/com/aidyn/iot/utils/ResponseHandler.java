package com.aidyn.iot.utils;

import com.aidyn.iot.dto.ResponseStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;


public class ResponseHandler {


    private ResponseHandler() {

    }

    public static ResponseEntity<Object> generateResponse(HttpStatus status, Object responseObj) {
        return ResponseEntity.status(status).contentType(MediaType.APPLICATION_JSON)
                .body(new ResponseStatus(status.value(), responseObj));
    }


}
