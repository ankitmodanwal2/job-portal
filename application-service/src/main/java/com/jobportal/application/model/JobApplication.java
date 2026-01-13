package com.jobportal.application.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private int jobId;

    @Column(nullable = false)
    private int userId;

    @Column(nullable = false)
    private String status; // APPLIED, SHORTLISTED, REJECTED

    private LocalDateTime appliedAt;
}