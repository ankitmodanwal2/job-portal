package com.jobportal.service;

import com.jobportal.dto.ApplicationResponse;
import com.jobportal.dto.ApplyJobRequest;
import com.jobportal.dto.UpdateStatusRequest;
import com.jobportal.entity.Job;
import com.jobportal.entity.JobApplication;
import com.jobportal.entity.User;
import com.jobportal.enums.ApplicationStatus;
import com.jobportal.exception.AccessDeniedException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.JobApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApiResponse<String> applyForJob(ApplyJobRequest request) {

        if (applicationRepository.existsByJobIdAndUserId(
                request.getJobId(), request.getUserId())) {
            throw new RuntimeException("Already applied for this job");
        }

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        JobApplication application = new JobApplication();
        application.setJob(job);
        application.setUser(user);
        application.setStatus(ApplicationStatus.APPLIED);
        application.setAppliedAt(LocalDateTime.now());

        applicationRepository.save(application);

        return ApiResponse.success("Job applied successfully", null);
    }

    public ApiResponse<List<ApplicationResponse>> getApplicationsByUser(Long userId) {

        List<ApplicationResponse> responses = applicationRepository
                .findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();

        return ApiResponse.success("Applications fetched", responses);
    }

    public ApiResponse<List<ApplicationResponse>> getApplicationsByJob(Long jobId) {

        List<ApplicationResponse> responses = applicationRepository
                .findByJobId(jobId)
                .stream()
                .map(this::mapToResponse)
                .toList();

        return ApiResponse.success("Applications fetched", responses);
    }

    public ApiResponse<String> updateStatus(
            Long applicationId, UpdateStatusRequest request) {

        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Application not found"));

        application.setStatus(request.getStatus());
        applicationRepository.save(application);

        return ApiResponse.success("Application status updated", null);
    }

    private ApplicationResponse mapToResponse(JobApplication app) {
        return new ApplicationResponse(
                app.getId(),
                app.getJob().getTitle(),
                app.getJob().getCompanyName(),
                app.getUser().getName(),
                app.getStatus(),
                app.getAppliedAt()
        );
    }
}
