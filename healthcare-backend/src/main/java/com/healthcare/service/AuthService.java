package com.healthcare.service;

import com.healthcare.dto.auth.ForgotPasswordRequest;
import com.healthcare.dto.auth.ResetPasswordRequest;
import com.healthcare.dto.auth.ForgotPasswordResponse;
import com.healthcare.dto.auth.LoginRequest;
import com.healthcare.dto.auth.LoginResponse;
import com.healthcare.dto.auth.RegisterRequest;
import com.healthcare.dto.common.ApiResponse;

public interface AuthService {

    ApiResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
    
    ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);
}