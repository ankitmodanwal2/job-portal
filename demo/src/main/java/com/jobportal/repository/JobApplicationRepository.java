package com.jobportal.repository;

import com.jobportal.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByUserId(Long userId);

    List<JobApplication> findByJobId(Long jobId);

    boolean existsByJobIdAndUserId(Long jobId, Long userId);
}
