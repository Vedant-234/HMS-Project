package com.hms.hms_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler("/medicine-images/**")
                .addResourceLocations("D:/SecretProject/hms_backend/hms_backend/src/main/java/com/hms/hms_backend/asset/medicine-images/")
                .setCachePeriod(0);

        registry.addResourceHandler("/labtest-images/**")
                .addResourceLocations("file:./asset/labtest-images/")
                .setCachePeriod(0);
    }
}