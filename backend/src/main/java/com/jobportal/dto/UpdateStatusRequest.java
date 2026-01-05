package com.jobportal.dto;


import com.jobportal.enums.ApplicationStatus;
import lombok.Data;

@Data
public class UpdateStatusRequest {
    private ApplicationStatus status;
}
