package com.example.demo.dto;

import com.example.demo.enums.Job_type;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobResponse
{
    private int id;
    private String title;
    private String description;
    private String location;
    private String companyName;
    private String salary;
    private Job_type jobType;
}
