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

}
