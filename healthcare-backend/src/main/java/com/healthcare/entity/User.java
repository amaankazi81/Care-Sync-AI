package com.healthcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
//import java.util.UUID;

@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_users_username", columnNames = "username"),
                @UniqueConstraint(name = "uk_users_email", columnNames = "email")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"password", "role"})
public class User extends BaseEntity {

    @NotBlank(message = "Username is required")
    @Size(min = 4, max = 50)
    @Column(nullable = false, length = 50)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email")
    @Column(nullable = false, length = 100)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 255)
    @Column(nullable = false)
    private String password;

    @NotBlank(message = "First name is required")
    @Size(max = 50)
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50)
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Phone number must contain exactly 10 digits"
    )
    @Column(name = "phone_number", length = 10)
    private String phoneNumber;

    @Builder.Default
    @Column(nullable = false)
    private boolean enabled = true;

    @Builder.Default
    @Column(name = "account_locked", nullable = false)
    private boolean accountLocked = false;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;
    
    @Column(name = "business_patient_id")
    private String businessPatientId;
    
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private PasswordResetToken passwordResetToken;
    
    
}