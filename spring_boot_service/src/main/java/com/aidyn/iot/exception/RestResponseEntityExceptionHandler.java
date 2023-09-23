package com.aidyn.iot.exception;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import com.aidyn.iot.utils.ResponseHandler;
import lombok.extern.slf4j.Slf4j;

@ControllerAdvice
@Slf4j
public class RestResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

  static final String MESSAGE =
      "Unable to process your request at this moment, Please contact Administartor for more details.";

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
      HttpHeaders headers, HttpStatus status, WebRequest request) {
    Map<String, String> errors = new HashMap<>();

    // @formatter:off
    ex.getBindingResult()
        .getAllErrors()
        .forEach(
            error -> {
              String fieldName = ((FieldError) error).getField();
              String errorMessage = error.getDefaultMessage();
              errors.put(fieldName, errorMessage);
            });
    // @formatter:on

    return ResponseHandler.generateResponse(HttpStatus.BAD_REQUEST, errors);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Object> handleInvalidRequest(IllegalArgumentException exception) {
    log.error("Invalid request received ", exception.getMessage());
    return ResponseHandler.generateResponse(HttpStatus.BAD_REQUEST,
        "Invalid request. Please check your request.");
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Object> handleGenericException(Exception exception) {
    log.error("handleGenericException ", exception);
    return ResponseHandler.generateResponse(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGE);
  }

  @ExceptionHandler(HomeIotException.class)
  public ResponseEntity<Object> handleUserManagementException(HomeIotException exception) {
    return ResponseHandler.generateResponse(exception.getStatus(), exception.getMessage());
  }
}
