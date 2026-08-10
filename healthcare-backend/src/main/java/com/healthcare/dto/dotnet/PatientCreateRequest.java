package com.healthcare.dto.dotnet;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientCreateRequest {

    // Basic Information
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;

    // Contact Information
    private String email;
    private String phone;
    private String address;

    // Emergency Contact
    private String emergencyContactName;
    private String emergencyContactNumber;
}