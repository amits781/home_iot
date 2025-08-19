package com.aidyn.iot.config;

import com.google.gson.Gson;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;
// import com.google.gson.Gson;

@Configuration
@EnableScheduling
public class AppConfigurations {

    // Timeout for all rest calls
    private final static Integer REST_TIMEOUT = 10000;

    @Bean
    public Gson getGsonObject() {
        return new Gson();
    }

    @Bean
    public RestTemplate getRestTemplate() {
        // Create a RestTemplate with a timeout configuration.
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(REST_TIMEOUT);
        factory.setReadTimeout(REST_TIMEOUT);
        return new RestTemplate(factory);
    }

    // @Bean
    // public FilterRegistrationBean<Filter> corsFilter() {
    //     UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    //     CorsConfiguration config = new CorsConfiguration();
    //     config.setAllowCredentials(false);
    //     config.addAllowedOrigin("*");
    //     config.setAllowedMethods(Arrays.asList("POST", "OPTIONS", "GET", "DELETE", "PUT", "PATCH"));
    //     config.setAllowedHeaders(Arrays.asList("X-Requested-With", "Origin", "Content-Type", "Accept",
    //             "Authorization", "token"));
    //     source.registerCorsConfiguration("/**", config);
    //     FilterRegistrationBean<Filter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
    //     bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
    //     return bean;
    // }
}
