package com.example.demo.dto;

import com.example.demo.enums.Job_type;
import com.example.demo.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobRequest
{

    private String title;
    private String description;
    private String location;
    private String companyName;
    private String salary;
    private Job_type jobType;
    //private int postedBy;


}
