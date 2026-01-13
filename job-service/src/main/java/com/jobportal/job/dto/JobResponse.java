package com.jobportal.job.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobResponse {
    private int id;
    private String title;
    private String description;
    private String location;
    private String companyName;
    private String salary;
    private String jobType;
    private int postedBy;
}