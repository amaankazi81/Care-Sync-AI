package com.healthcare.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.healthcare.entity.Role;
import com.healthcare.enums.RoleType;
import com.healthcare.repository.RoleRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {

        createRole(RoleType.ADMIN, "Administrator");
        createRole(RoleType.DOCTOR, "Doctor");
        createRole(RoleType.PATIENT, "Patient");
        createRole(RoleType.RECEPTIONIST, "Receptionist");
    }

    private void createRole(RoleType roleType, String description) {

        if (roleRepository.findByName(roleType).isEmpty()) {

            Role role = Role.builder()
                    .name(roleType)
                    .description(description)
                    .build();

            roleRepository.save(role);
        }

    }

}