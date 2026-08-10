package com.healthcare.service;

import com.healthcare.dto.user.ChangePasswordRequest;
import com.healthcare.dto.user.UpdateUserProfileRequest;
import com.healthcare.dto.user.UserProfileResponse;
import com.healthcare.entity.User;

public interface UserService {

    User save(User user);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    User findByUsername(String username);

    UserProfileResponse getCurrentUserProfile();

    UserProfileResponse updateCurrentUserProfile(UpdateUserProfileRequest request);
    
    void changePassword(ChangePasswordRequest request);

}