package com.jobportal.application.repository;

import com.jobportal.application.model.JobApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Integer> {
    List<JobApplication> findAllByUserId(int userId);
    Page<JobApplication> findAllByJobId(int jobId, Pageable pageable);
    boolean existsByJobIdAndUserId(int jobId, int userId);
}