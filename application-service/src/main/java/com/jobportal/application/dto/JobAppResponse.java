package com.jobportal.application.dto;

import com.jobportal.common.dto.JobDTO;
import com.jobportal.common.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobAppResponse {
    private int applicationId;
    private JobDTO job;
    private UserDTO user;
    private String status;
    private LocalDateTime appliedAt;
}