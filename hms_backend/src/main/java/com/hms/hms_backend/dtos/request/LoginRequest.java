package com.hms.hms_backend.dtos.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}