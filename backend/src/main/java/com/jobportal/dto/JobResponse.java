package com.jobportal.dto;

import com.jobportal.enums.JobType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String companyName;
    private Double salary;
    private JobType jobType;
    private String postedBy;
    private LocalDateTime createdAt;
}
