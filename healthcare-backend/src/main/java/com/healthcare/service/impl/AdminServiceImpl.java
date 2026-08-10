package com.healthcare.service.impl;

import com.healthcare.dto.admin.CreateReceptionistRequest;
import com.healthcare.entity.Role;
import com.healthcare.entity.User;
import com.healthcare.enums.RoleType;
import com.healthcare.repository.RoleRepository;
import com.healthcare.repository.UserRepository;
import com.healthcare.service.AdminService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public void createReceptionist(CreateReceptionistRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists.");
        }

        Role receptionistRole = roleRepository
                .findByName(RoleType.RECEPTIONIST)
                .orElseThrow(() ->
                        new RuntimeException("Receptionist role not found."));

        User receptionist = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(receptionistRole)
                .enabled(true)
                .accountLocked(false)
                .build();

        userRepository.save(receptionist);
    }
}