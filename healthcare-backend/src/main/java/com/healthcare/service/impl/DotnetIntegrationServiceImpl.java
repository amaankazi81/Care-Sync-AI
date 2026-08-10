package com.healthcare.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import com.healthcare.dto.auth.RegisterRequest;
import com.healthcare.dto.dotnet.DoctorCreateRequest;
import com.healthcare.dto.dotnet.PatientCreateRequest;
import com.healthcare.entity.User;
import com.healthcare.service.DotnetIntegrationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DotnetIntegrationServiceImpl implements DotnetIntegrationService {

    private final RestTemplate restTemplate;

    @Value("${dotnet.api.url}")
    private String dotnetUrl;

    @Override
    public void createDoctorProfile(User user, RegisterRequest registerRequest) {

        DoctorCreateRequest request = DoctorCreateRequest.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhoneNumber())
                .gender(registerRequest.getGender())
                .specialization(registerRequest.getSpecialization())
                .qualification(registerRequest.getQualification())
                .experience(registerRequest.getExperience())
                .roomNumber(registerRequest.getRoomNumber())
                .departmentId(registerRequest.getDepartmentId())
                .build();

        try {

            restTemplate.postForObject(
            		dotnetUrl + "/doctors/internal",
                    request,
                    Object.class
            );

        } catch (HttpStatusCodeException ex) {

            throw new RuntimeException(
                    ".NET Business API profile creation failed: "
                            + ex.getResponseBodyAsString(),
                    ex
            );

        } catch (Exception ex) {

            throw new RuntimeException(
                    "Failed to connect to .NET Business API.",
                    ex
            );
        }
    }

    @Override
    public void createPatientProfile(User user, RegisterRequest registerRequest) {

        PatientCreateRequest request = PatientCreateRequest.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .dateOfBirth(registerRequest.getDateOfBirth())
                .gender(registerRequest.getGender())
                .bloodGroup(registerRequest.getBloodGroup())
                .email(user.getEmail())
                .phone(user.getPhoneNumber())
                .address(registerRequest.getAddress())
                .emergencyContactName(registerRequest.getEmergencyContactName())
                .emergencyContactNumber(registerRequest.getEmergencyContactNumber())
                .build();

        try {

            restTemplate.postForObject(
                    dotnetUrl + "/patients",
                    request,
                    Object.class
            );

        } catch (HttpStatusCodeException ex) {

            throw new RuntimeException(
                    ".NET Business API profile creation failed: "
                            + ex.getResponseBodyAsString(),
                    ex
            );

        } catch (Exception ex) {

            throw new RuntimeException(
                    "Failed to connect to .NET Business API.",
                    ex
            );
        }
    }
}