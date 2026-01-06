package com.example.demo.model;

import com.example.demo.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobApplication
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(
            name = "jobId",
            nullable = false)
    private Job job;

    @ManyToOne
    @JoinColumn(
            name = "userId",
            nullable = false)
    private User user;
    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime appliedAt;
}
