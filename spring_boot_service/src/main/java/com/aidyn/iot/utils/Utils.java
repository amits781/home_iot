package com.aidyn.iot.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.format.TextStyle;
import java.time.temporal.ChronoField;
import java.time.temporal.ChronoUnit;
import java.util.Locale;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class Utils {


  private Utils() {}


  public static Object getCurrentUser() {

    HttpServletRequest httpServletRequest =
        ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
    return httpServletRequest.getAttribute("USER");
  }

  public static void setAssistantUser() {

    HttpServletRequest httpServletRequest =
        ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
    httpServletRequest.setAttribute("USER", "assistant");
  }

  public static String getFormatedDate(LocalDateTime date) {
    DateTimeFormatter formatter = new DateTimeFormatterBuilder()
        // Day of month without leading zeros
        .appendPattern("d ")
        // Full month name
        .appendText(ChronoField.MONTH_OF_YEAR, TextStyle.FULL)
        // Year, 'at' keyword, hour, minute, and AM/PM
        .appendPattern(", yyyy 'at' h:mma")
        // Use English locale for month names
        .toFormatter(Locale.ENGLISH);

    // Format the LocalDateTime to a human-readable string
    return date.format(formatter);
  }

  public static long getDurationInSeconds(LocalDateTime start, LocalDateTime end) {
    return ChronoUnit.SECONDS.between(start, end);
  }
}
