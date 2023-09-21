package com.aidyn.iot.config;
import org.springframework.boot.actuate.info.Info;
import org.springframework.boot.actuate.info.InfoContributor;
import org.springframework.stereotype.Component;

@Component
public class BuildVersionInfoContributor implements InfoContributor {

    @Override
    public void contribute(Info.Builder builder) {
        // You can fetch the build version from your application's properties or any other source
        String buildVersion = "1.0.0"; // Replace with your actual build version
        builder.withDetail("buildVersion", buildVersion);
        builder.withDetail("contact", "amits781@gmail.com");
    }
}
