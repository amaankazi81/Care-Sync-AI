package com.healthcare.controller;

import com.healthcare.dto.admin.CreateReceptionistRequest;
import com.healthcare.service.AdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {


    private final AdminService adminService;



    @PostMapping("/create-receptionist")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createReceptionist(
            @Valid @RequestBody CreateReceptionistRequest request
    ) {

        adminService.createReceptionist(request);


        return ResponseEntity.ok(
                "Receptionist created successfully"
        );
    }

}