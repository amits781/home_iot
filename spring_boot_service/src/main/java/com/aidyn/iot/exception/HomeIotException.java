package com.aidyn.iot.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class HomeIotException extends RuntimeException {

    private static final long serialVersionUID = 3404434161799702443L;
    private HttpStatus status;

    public HomeIotException(String msg, HttpStatus status) {
        super(msg);
        this.status = status;
    }
}
