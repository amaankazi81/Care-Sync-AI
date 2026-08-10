package com.healthcare.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "registration.codes")
@Getter
@Setter
public class RegistrationCodeProperties {

    private String admin;

    private String doctor;

    private String receptionist;
}
