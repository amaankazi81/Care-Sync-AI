package com.healthcare.dto.auth;

import java.time.LocalDate;
import java.util.UUID;

import com.healthcare.enums.RoleType;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
public class RegisterRequest {

    // ==========================
    // Common Fields
    // ==========================

    @NotBlank(message = "Username is required")
    @Size(min = 4, max = 50)
    private String username;

    @NotBlank(message = "Email is required")
    @Email
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 20)
    private String password;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Phone number must contain exactly 10 digits"
    )
    private String phoneNumber;

    @NotNull(message = "Role is required")
    private RoleType role;

    // Required only for ADMIN / DOCTOR / RECEPTIONIST
    private String registrationCode;

    // ==========================================
    // Doctor Fields (Forwarded to .NET)
    // ==========================================

    private String specialization;

    private String qualification;

    private Integer experience;

    private String roomNumber;

    private UUID departmentId;

    @Builder.Default
    private Boolean isAvailable = true;

    // ==========================================
    // Patient Fields (Forwarded to .NET)
    // ==========================================

    private LocalDate dateOfBirth;

    private String gender;

    private String bloodGroup;

    private String address;

    private String emergencyContactName;

    private String emergencyContactNumber;
}