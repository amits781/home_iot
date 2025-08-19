package com.aidyn.iot.config;

import org.springframework.boot.actuate.info.Info;
import org.springframework.boot.actuate.info.InfoContributor;
import org.springframework.stereotype.Component;

@Component
public class BuildVersionInfoContributor implements InfoContributor {

    @Override
    public void contribute(Info.Builder builder) {
        String buildVersion = "1.2.0";
        builder.withDetail("buildVersion", buildVersion);
        builder.withDetail("contact", "amits781@gmail.com");
    }
}
