package com.aidyn.iot.config;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import com.aidyn.iot.annotation.ScopeValidator;
import com.aidyn.iot.dao.UserDao;
import com.aidyn.iot.entity.User;
import com.aidyn.iot.exception.HomeIotException;
import com.nimbusds.jose.shaded.json.JSONObject;
import lombok.extern.slf4j.Slf4j;

@Aspect
@Configuration
@Slf4j
public class AuthorizationAspect {

  @Autowired
  private HttpServletRequest httpServletRequest;

  @Autowired
  private UserDao userDao;

  private final static String FORBIDDEN = "FORBIDDEN";

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
    JSONObject organization = principal.getClaim("organization");
    log.info("Roles received: {}", roles);
    Map<String, String> orgDetails = getMapForJsonClaim(organization);
    log.info("Organization details received: {}", orgDetails);

    if (roles == null || roles.isBlank() || orgDetails == null || orgDetails.isEmpty()) {
      log.info("Invalid Roles {}  or Organization {} received", roles, organization);
      throw new HomeIotException(FORBIDDEN, HttpStatus.FORBIDDEN);
    }

    List<String> scopeList = new ArrayList<>(Arrays.asList(roles.split(" ")));

    if (!scopeList.contains(scopeValidator.roles())
        || !organization.containsKey(scopeValidator.organization())) {
      throw new HomeIotException(FORBIDDEN, HttpStatus.FORBIDDEN);
    }

    String sub = principal.getClaim("sub");
    String email = principal.getClaim("email");
    String name = principal.getClaim("name");
    log.info("Sub:{}", sub);
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

  private Map<String, String> getMapForJsonClaim(JSONObject jsonString) {
    return jsonString.entrySet().stream().collect(
        Collectors.toMap(entry -> entry.getKey().toString(), entry -> entry.getValue().toString()));
  }

}
