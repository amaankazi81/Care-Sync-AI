package com.healthcare.dto.dotnet;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PatientCreateResponse {

    private boolean success;
    private String message;
    private PatientData data;

    @Getter
    @Setter
    public static class PatientData {
        private String id;
    }
}