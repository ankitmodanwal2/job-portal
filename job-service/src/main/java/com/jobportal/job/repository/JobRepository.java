package com.jobportal.job.repository;

import com.jobportal.job.model.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Integer> {
    Optional<Job> findJobById(int id);
    List<Job> findByPostedBy(int userId);
    Page<Job> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);
    Page<Job> findByLocationContainingIgnoreCase(String location, Pageable pageable);
    Page<Job> findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(
            String keyword, String location, Pageable pageable);
    boolean existsByTitle(String title);
}
