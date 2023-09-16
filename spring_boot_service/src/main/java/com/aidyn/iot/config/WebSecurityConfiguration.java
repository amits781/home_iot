package com.aidyn.iot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.resource.OAuth2ResourceServerConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class WebSecurityConfiguration {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    // @formatter:off
    http.csrf().disable()
      .authorizeRequests()
      .antMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
      .antMatchers("/motorStatus").authenticated()
      .antMatchers("/motorOn").authenticated()
      .antMatchers("/motorOff").authenticated()
      .and()
      .oauth2ResourceServer(OAuth2ResourceServerConfigurer::jwt);
  // @formatter:on

    return http.build();
  }
}
