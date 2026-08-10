package com.healthcare.service;

public interface EmailService {

    void sendPasswordResetEmail(String toEmail, String token);

}