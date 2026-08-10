package com.healthcare.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthcare.dto.user.ChangePasswordRequest;
import com.healthcare.dto.user.UpdateUserProfileRequest;
import com.healthcare.dto.user.UserProfileResponse;
import com.healthcare.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
@Tag(name = "User APIs", description = "Logged-in User Operations")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    private final UserService userService;

    @Operation(summary = "Get Logged-in User Profile")
    @GetMapping("/me")
    public UserProfileResponse getCurrentUserProfile() {
        return userService.getCurrentUserProfile();
    }

    @Operation(summary = "Update Logged-in User Profile")
    @PutMapping("/me")
    public UserProfileResponse updateCurrentUserProfile(
            @Valid @RequestBody UpdateUserProfileRequest request) {

        return userService.updateCurrentUserProfile(request);
    }

    @Operation(summary = "Change Password")
    @PutMapping("/change-password")
    public String changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {

        userService.changePassword(request);

        return "Password changed successfully";
    }
}