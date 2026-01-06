package com.example.demo.repository;

import com.example.demo.model.Job;
import com.example.demo.model.JobApplication;
import com.example.demo.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

public interface JobAppRepository extends JpaRepository<JobApplication,Integer> {
    Optional<JobApplication> findJobApplicationByJob(Job job);

    Optional<JobApplication> findJobApplicationById(int id);

    Optional<JobApplication> findJobApplicationByUser(User user);

    List<JobApplication> findAllByUser(User user);

    Page<JobApplication> findAllByJob(Job job, Pageable pageable);

    boolean existsByJob(Job job);

    boolean existsByUser(User user);
    boolean existsByJobAndUser(Job job, User user);
}
