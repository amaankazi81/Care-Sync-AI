package com.healthcare.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/test")
@Tag(name = "Role Test APIs", description = "Role Based Authorization Testing")
public class RoleTestController {

    @Operation(summary = "Authenticated User Access")
    @GetMapping("/user")
    public String userAccess() {
        return "USER ACCESS SUCCESS";
    }

    @Operation(summary = "Admin Access")
    @GetMapping("/admin")
    public String adminAccess() {
        return "ADMIN ACCESS SUCCESS";
    }

    @Operation(summary = "Doctor Access")
    @GetMapping("/doctor")
    public String doctorAccess() {
        return "DOCTOR ACCESS SUCCESS";
    }

    @Operation(summary = "Patient Access")
    @GetMapping("/patient")
    public String patientAccess() {
        return "PATIENT ACCESS SUCCESS";
    }
}