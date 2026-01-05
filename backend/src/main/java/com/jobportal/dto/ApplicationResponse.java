package com.jobportal.dto;

import com.jobportal.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationResponse {
    private Long applicationId;
    private String jobTitle;
    private String companyName;
    private String applicantName;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
}
