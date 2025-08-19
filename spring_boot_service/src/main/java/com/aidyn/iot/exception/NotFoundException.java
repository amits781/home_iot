package com.aidyn.iot.exception;

public class NotFoundException extends RuntimeException {

    private static final long serialVersionUID = 3404434161799702443L;

    public NotFoundException(String msg) {
        super(msg);
    }

}
