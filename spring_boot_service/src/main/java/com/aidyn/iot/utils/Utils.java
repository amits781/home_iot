package com.aidyn.iot.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.format.TextStyle;
import java.time.temporal.ChronoField;
import java.util.Locale;

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
  
  public static String getFormatedDate(LocalDateTime date) {
	// Create a custom formatter
      DateTimeFormatter formatter = new DateTimeFormatterBuilder()
              .appendPattern("d ") // Day of month without leading zeros
              .appendText(ChronoField.MONTH_OF_YEAR, TextStyle.FULL) // Full month name
              .appendPattern(", yyyy 'at' h:mma") // Year, 'at' keyword, hour, minute, and AM/PM
              .toFormatter(Locale.ENGLISH); // Use English locale for month names

      // Format the LocalDateTime to a human-readable string
      return date.format(formatter);
  }


}
