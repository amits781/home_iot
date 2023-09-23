package com.aidyn.iot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;

@SpringBootApplication
@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableScheduling
public class HomeIotControllerApplication {

  public static void main(String[] args) {
    SpringApplication.run(HomeIotControllerApplication.class, args);
  }

}
