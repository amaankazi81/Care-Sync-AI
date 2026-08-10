package com.healthcare.service.impl;

import com.healthcare.config.RegistrationCodeProperties;
import com.healthcare.dto.auth.ForgotPasswordRequest;
import com.healthcare.dto.auth.ForgotPasswordResponse;
import com.healthcare.dto.auth.ResetPasswordRequest;

import com.healthcare.entity.PasswordResetToken;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.healthcare.dto.auth.LoginRequest;
import com.healthcare.dto.auth.LoginResponse;
import com.healthcare.dto.auth.RegisterRequest;
import com.healthcare.dto.common.ApiResponse;
import com.healthcare.entity.Role;
import com.healthcare.entity.User;
import com.healthcare.enums.RoleType;
import com.healthcare.exception.BadRequestException;
import com.healthcare.exception.ResourceAlreadyExistsException;
import com.healthcare.exception.ResourceNotFoundException;
import com.healthcare.repository.PasswordResetTokenRepository;
import com.healthcare.repository.RoleRepository;
import com.healthcare.repository.UserRepository;
import com.healthcare.security.CustomUserDetails;
import com.healthcare.security.JwtService;
import com.healthcare.service.AuthService;
import com.healthcare.service.DotnetIntegrationService;
import com.healthcare.service.EmailService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RegistrationCodeProperties registrationCodeProperties;
    private final DotnetIntegrationService dotnetIntegrationService;
    

    @Override
    @Transactional(rollbackOn = Exception.class)
    public ApiResponse register(RegisterRequest request) {

        // Check username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResourceAlreadyExistsException("Username already exists");
        }

        // Check email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already exists");
        }

        // Validate Registration Code
        switch (request.getRole()) {

            case ADMIN:

                if (!java.util.Objects.equals(
                        registrationCodeProperties.getAdmin(),
                        request.getRegistrationCode())) {

                    throw new BadRequestException("Invalid Admin Registration Code");
                }

                break;

            case DOCTOR:

                if (!java.util.Objects.equals(
                        registrationCodeProperties.getDoctor(),
                        request.getRegistrationCode())) {

                    throw new BadRequestException("Invalid Doctor Registration Code");
                }

                break;

            case RECEPTIONIST:

                if (!java.util.Objects.equals(
                        registrationCodeProperties.getReceptionist(),
                        request.getRegistrationCode())) {

                    throw new BadRequestException("Invalid Receptionist Registration Code");
                }

                break;

            case PATIENT:
                // No registration code required
                break;

            default:
                throw new BadRequestException("Invalid Role");
        }

        // Fetch Role
        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Role not found"));

        // Create User
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .enabled(true)
                .accountLocked(false)
                .role(role)
                .build();

        userRepository.save(user);

        try {

            switch (request.getRole()) {

                case DOCTOR:
                    dotnetIntegrationService.createDoctorProfile(user, request);
                    break;

                case PATIENT:
                    dotnetIntegrationService.createPatientProfile(user, request);
                    break;

                default:
                    // ADMIN and RECEPTIONIST don't have business profiles
                    break;
            }

        } catch (Exception ex) {

            throw new RuntimeException(
                    ".NET Business API profile creation failed: " + ex.getMessage(),
                    ex
            );
        }

        return ApiResponse.builder()
                .success(true)
                .message("User Registered Successfully")
                .build();
    }
    
    
    @Override
    public LoginResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        CustomUserDetails userDetails = new CustomUserDetails(user);

        String accessToken = jwtService.generateToken(userDetails);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(null)
                .tokenType("Bearer")
                .expiresIn(86400000L)

                .username(user.getUsername())
                .role(user.getRole().getName().name())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())

                .build();
    }
    
    @Override
    @Transactional
    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("No account found with this email"));

        // Delete old token if present
        passwordResetTokenRepository.deleteByUser(user);

        // Generate new token
        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(30))
                .build();

        passwordResetTokenRepository.save(resetToken);

     // Send email
     emailService.sendPasswordResetEmail(
             user.getEmail(),
             token
     );

     return new ForgotPasswordResponse(
    	        "Password reset link has been sent to your email."
    	);
    }
    
    @Override
    public void resetPassword(ResetPasswordRequest request) {

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
        	throw new BadRequestException("Passwords do not match");        }

        PasswordResetToken resetToken =
                passwordResetTokenRepository.findByToken(request.getToken())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Invalid reset token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
        	throw new BadRequestException("Invalid or expired token");        }

        User user = resetToken.getUser();

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        passwordResetTokenRepository.delete(resetToken);
    }
    
}