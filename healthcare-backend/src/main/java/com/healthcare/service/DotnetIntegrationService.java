package com.healthcare.service;

import com.healthcare.dto.auth.RegisterRequest;
import com.healthcare.entity.User;

public interface DotnetIntegrationService {

    void createDoctorProfile(User user, RegisterRequest request);

    void createPatientProfile(User user, RegisterRequest request);

}