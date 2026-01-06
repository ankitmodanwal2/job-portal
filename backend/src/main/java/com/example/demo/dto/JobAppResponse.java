package com.example.demo.dto;

import com.example.demo.enums.Status;
import com.example.demo.model.Job;
import com.example.demo.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobAppResponse
{
    private Job job;
    private User user;
    private Status status;
    private LocalDateTime appliedAt;
}
