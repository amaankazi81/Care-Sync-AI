package com.healthcare.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import com.healthcare.dto.auth.RegisterRequest;
import com.healthcare.dto.dotnet.DoctorCreateRequest;
import com.healthcare.dto.dotnet.PatientCreateRequest;
import com.healthcare.dto.dotnet.PatientCreateResponse;
import com.healthcare.entity.User;
import com.healthcare.repository.UserRepository;
import com.healthcare.service.DotnetIntegrationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DotnetIntegrationServiceImpl implements DotnetIntegrationService {

    private final RestTemplate restTemplate;
    
    private final UserRepository userRepository;

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

            System.out.println("==========================================");
            System.out.println("DOTNET DOCTOR PROFILE CREATION FAILED");
            System.out.println("Status Code: " + ex.getStatusCode());
            System.out.println("Status Text: " + ex.getStatusText());
            System.out.println("Response Body: " + ex.getResponseBodyAsString());
            System.out.println("==========================================");

            throw new RuntimeException(
                    ".NET Business API profile creation failed. "
                            + "HTTP Status: " + ex.getStatusCode()
                            + ", Response: " + ex.getResponseBodyAsString(),
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
    public void createPatientProfile(
            User user,
            RegisterRequest registerRequest) {

        PatientCreateRequest request =
                PatientCreateRequest.builder()
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .dateOfBirth(registerRequest.getDateOfBirth())
                        .gender(registerRequest.getGender())
                        .bloodGroup(registerRequest.getBloodGroup())
                        .email(user.getEmail())
                        .phone(user.getPhoneNumber())
                        .address(registerRequest.getAddress())
                        .emergencyContactName(
                                registerRequest.getEmergencyContactName())
                        .emergencyContactNumber(
                                registerRequest.getEmergencyContactNumber())
                        .build();

        try {

            PatientCreateResponse response =
                    restTemplate.postForObject(
                            dotnetUrl + "/patients",
                            request,
                            PatientCreateResponse.class
                    );

            if (response == null ||
                response.getData() == null ||
                response.getData().getId() == null) {

                throw new RuntimeException(
                        "Patient was created but patient ID was not returned by .NET."
                );
            }

            String patientId = response.getData().getId();

            System.out.println(
                    "=========================================="
            );

            System.out.println(
                    "PATIENT CREATED IN .NET"
            );

            System.out.println(
                    "Patient ID returned by .NET: " + patientId
            );

            System.out.println(
                    "Spring username: " + user.getUsername()
            );

            System.out.println(
                    "=========================================="
            );

            user.setBusinessPatientId(patientId);

            userRepository.save(user);

            System.out.println(
                    "Saved businessPatientId to Spring user: "
                            + user.getBusinessPatientId()
            );

        } catch (HttpStatusCodeException ex) {

            throw new RuntimeException(
                    ".NET Business API profile creation failed: "
                            + ex.getResponseBodyAsString(),
                    ex
            );

        } catch (Exception ex) {

            throw new RuntimeException(
                    "Failed to create patient profile.",
                    ex
            );
        }
    }
}