package com.example.demo.model;

import com.example.demo.enums.Job_type;
import com.example.demo.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Job
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false, unique = true)
    private String title;
    @Column(nullable = false)
    private String description;
    @Column(nullable = false)
    private String location;
    @Column(nullable = false)
    private String companyName;
    @Column(nullable = false)
    private String salary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Job_type jobType;
    @ManyToOne
    @JoinColumn(name="posted_by")
    private User postedBy;
    private LocalDateTime createdAt;


}
