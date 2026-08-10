package com.healthcare.dto.dotnet;

import java.util.UUID;

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
public class DoctorCreateRequest {

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String gender;

    private String specialization;

    private String qualification;

    private Integer experience;

    private String roomNumber;

    @Builder.Default
    private Boolean isAvailable = true;

    private UUID departmentId;
}