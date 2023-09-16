package com.aidyn.iot.annotation;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface ScopeValidator {

  String roles();

  String organization();
}
