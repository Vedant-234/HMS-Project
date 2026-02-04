package com.hms.hms_backend.dtos.request;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String email;
    private String newPassword;
}