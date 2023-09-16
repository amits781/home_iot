package com.aidyn.iot.config;

import java.util.Arrays;

import javax.servlet.Filter;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.google.gson.Gson;
//import com.google.gson.Gson;

@Configuration
public class AppConfigurations {

	@Bean
	public Gson getGsonObject() {
		return new Gson();
	}

	@Bean
	public FilterRegistrationBean<Filter> corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowCredentials(false);
		config.addAllowedOrigin("*");
		config.setAllowedMethods(Arrays.asList("POST", "OPTIONS", "GET",
				"DELETE", "PUT", "PATCH"));
		config.setAllowedHeaders(Arrays.asList("X-Requested-With", "Origin",
				"Content-Type", "Accept", "Authorization", "token"));
		source.registerCorsConfiguration("/**", config);
		FilterRegistrationBean<Filter> bean = new FilterRegistrationBean<>(
				new CorsFilter(source));
		bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
		return bean;
	}
}
