package com.aidyn.iot.utils;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.aidyn.iot.entity.User;

public class Utils {


  private Utils() {}


  public static User getCurrentUser() {

    HttpServletRequest httpServletRequest =
        ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
    return (User) httpServletRequest.getAttribute("USER");
  }


}
