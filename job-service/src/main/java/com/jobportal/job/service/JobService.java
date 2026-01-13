package com.jobportal.job.service;

import com.jobportal.common.dto.ApiResponse;
import com.jobportal.common.exception.ResourceNotFoundException;
import com.jobportal.job.dto.JobRequest;
import com.jobportal.job.dto.JobResponse;
import com.jobportal.job.feign.UserServiceClient;
import com.jobportal.job.model.Job;
import com.jobportal.job.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {
    private final JobRepository jobRepository;
    private final UserServiceClient userServiceClient;

    public ApiResponse<Void> createJob(JobRequest request, int userId) {
        if (jobRepository.existsByTitle(request.getTitle())) {
            throw new RuntimeException("Job already exists");
        }

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setCompanyName(request.getCompanyName());
        job.setJobType(request.getJobType());
        job.setPostedBy(userId);
        job.setCreatedAt(LocalDateTime.now());
        jobRepository.save(job);

        return ApiResponse.success("Job created successfully", null);
    }

    public ApiResponse<List<JobResponse>> getAllJobs() {
        List<JobResponse> jobs = jobRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
        return ApiResponse.success("Jobs fetched successfully", jobs);
    }

    public ApiResponse<JobResponse> getJobById(int jobId) {
        Job job = jobRepository.findJobById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        return ApiResponse.success("Job fetched", mapToResponse(job));
    }

    public ApiResponse<Void> deleteJob(int jobId, int userId) {
        Job job = jobRepository.findJobById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (job.getPostedBy() != userId) {
            throw new RuntimeException("Unauthorized to delete this job");
        }

        jobRepository.delete(job);
        return ApiResponse.success("Job deleted successfully", null);
    }

    public ApiResponse<Page<JobResponse>> searchJobs(String keyword, String location,
                                                     int page, int size,
                                                     String sortBy, String direction) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(sortDirection, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<JobResponse> jobs;
        if (keyword != null && location != null) {
            jobs = jobRepository.findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(
                    keyword, location, pageable).map(this::mapToResponse);
        } else if (keyword != null) {
            jobs = jobRepository.findByTitleContainingIgnoreCase(keyword, pageable)
                    .map(this::mapToResponse);
        } else if (location != null) {
            jobs = jobRepository.findByLocationContainingIgnoreCase(location, pageable)
                    .map(this::mapToResponse);
        } else {
            jobs = jobRepository.findAll(pageable).map(this::mapToResponse);
        }

        return ApiResponse.success("Jobs fetched successfully", jobs);
    }

    public ApiResponse<List<JobResponse>> getJobsByUser(int userId) {
        List<JobResponse> jobs = jobRepository.findByPostedBy(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
        return ApiResponse.success("User jobs fetched", jobs);
    }

    private JobResponse mapToResponse(Job job) {
        return new JobResponse(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getLocation(),
                job.getCompanyName(),
                job.getSalary(),
                job.getJobType(),
                job.getPostedBy()
        );
    }
}