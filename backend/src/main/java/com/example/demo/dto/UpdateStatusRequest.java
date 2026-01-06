package com.example.demo.dto;


import com.example.demo.enums.Status;
import lombok.Data;

@Data
public class UpdateStatusRequest {
    private Status status;
}
