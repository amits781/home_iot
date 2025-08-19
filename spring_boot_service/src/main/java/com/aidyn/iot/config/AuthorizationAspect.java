package com.aidyn.iot.config;

import com.aidyn.iot.annotation.ScopeValidator;
import com.aidyn.iot.dao.UserDao;
import com.aidyn.iot.entity.User;
import com.aidyn.iot.exception.HomeIotException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.*;
import java.util.stream.Collectors;

@Aspect
@Configuration
@Slf4j
public class AuthorizationAspect {

    private final static String FORBIDDEN = "FORBIDDEN";
    @Autowired
    private HttpServletRequest httpServletRequest;
    @Autowired
    private UserDao userDao;

    @Around("@within(com.aidyn.iot.annotation.ScopeValidator)")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {

        Class<?> targetClass = joinPoint.getTarget().getClass();
        ScopeValidator scopeValidator = targetClass.getAnnotation(ScopeValidator.class);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null
                || authentication.getPrincipal() instanceof String)
            throw new HomeIotException("Unauthorized", HttpStatus.UNAUTHORIZED);

        Jwt principal = (Jwt) authentication.getPrincipal();

        String roles = principal.getClaim("roles");
        Map<String, Object> organization = principal.getClaimAsMap("organization");
        log.info("Roles received: {}", roles);
        Map<String, String> orgDetails = getMapForJsonClaim(organization);
        log.info("Organization details received: {}", orgDetails);

        if (roles == null || roles.isBlank() || orgDetails == null || orgDetails.isEmpty()) {
            log.info("Invalid Roles {}  or Organization {} received", roles, organization);
            throw new HomeIotException(FORBIDDEN, HttpStatus.FORBIDDEN);
        }

        List<String> scopeList = new ArrayList<>(Arrays.asList(roles.split(" ")));

        if (!scopeList.contains(scopeValidator.roles())
                || !organization.keySet().contains(scopeValidator.organization())) {
            throw new HomeIotException(FORBIDDEN, HttpStatus.FORBIDDEN);
        }

        String email = principal.getClaim("email");
        String name = principal.getClaim("name");
        Optional<User> dbUser = userDao.getUserByEmail(email);
        User user;
        if (dbUser.isEmpty()) {
            user = User.builder().displayName(name).regEmail(email).build();
            user = userDao.saveUser(user);
            log.info("Added new user: id {} || name {}", user.getId(), user.getDisplayName());
        } else {
            user = dbUser.get();
        }
        httpServletRequest.setAttribute("USER", user);

        return joinPoint.proceed();
    }

    private Map<String, String> getMapForJsonClaim(Map<String, Object> jsonString) {
        return jsonString.entrySet().stream().collect(
                Collectors.toMap(Map.Entry::getKey, entry -> entry.getValue().toString()));
    }

}
