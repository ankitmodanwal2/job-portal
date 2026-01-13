package com.jobportal.application.service;

import com.jobportal.application.dto.JobAppRequest;
import com.jobportal.application.dto.JobAppResponse;
import com.jobportal.application.feign.JobServiceClient;
import com.jobportal.application.feign.UserServiceClient;
import com.jobportal.application.model.JobApplication;
import com.jobportal.application.repository.JobApplicationRepository;
import com.jobportal.common.dto.ApiResponse;
import com.jobportal.common.dto.JobDTO;
import com.jobportal.common.dto.UserDTO;
import com.jobportal.common.exception.ResourceNotFoundException;
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
public class JobApplicationService {
    private final JobApplicationRepository applicationRepository;
    private final UserServiceClient userServiceClient;
    private final JobServiceClient jobServiceClient;

    public ApiResponse<Void> apply(JobAppRequest request, int userId) {
        // Verify job exists
        ApiResponse<JobDTO> jobResponse = jobServiceClient.getJobById(request.getJobId());
        if (!jobResponse.isStatus()) {
            throw new ResourceNotFoundException("Job not found");
        }
        JobDTO job = jobResponse.getData();

        // Check if user is trying to apply to their own job
        if (job.getPostedBy() == userId) {
            throw new RuntimeException("Cannot apply to your own job");
        }

        // Check if already applied
        if (applicationRepository.existsByJobIdAndUserId(request.getJobId(), userId)) {
            throw new RuntimeException("Already applied to this job");
        }

        JobApplication application = new JobApplication();
        application.setJobId(request.getJobId());
        application.setUserId(userId);
        application.setStatus("APPLIED");
        application.setAppliedAt(LocalDateTime.now());
        applicationRepository.save(application);

        return ApiResponse.success("Applied successfully", null);
    }

    public ApiResponse<List<JobAppResponse>> getApplicationsByUser(int userId) {
        List<JobApplication> applications = applicationRepository.findAllByUserId(userId);
        List<JobAppResponse> responses = applications.stream()
                .map(this::mapToResponse)
                .toList();
        return ApiResponse.success("Applications fetched", responses);
    }

    public ApiResponse<Page<JobAppResponse>> getApplicationsByJob(
            int jobId, int userId, int page, int size, String sortBy, String direction) {

        // Verify the job belongs to the user
        ApiResponse<JobDTO> jobResponse = jobServiceClient.getJobById(jobId);
        if (!jobResponse.isStatus()) {
            throw new ResourceNotFoundException("Job not found");
        }

        JobDTO job = jobResponse.getData();
        if (job.getPostedBy() != userId) {
            throw new RuntimeException("Unauthorized to view applications");
        }

        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Page<JobAppResponse> applications = applicationRepository
                .findAllByJobId(jobId, pageable)
                .map(this::mapToResponse);

        return ApiResponse.success("Applications fetched", applications);
    }

    public ApiResponse<Void> updateStatus(int applicationId, String status, int userId) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        // Verify the user owns the job
        ApiResponse<JobDTO> jobResponse = jobServiceClient.getJobById(application.getJobId());
        if (!jobResponse.isStatus()) {
            throw new ResourceNotFoundException("Job not found");
        }

        JobDTO job = jobResponse.getData();
        if (job.getPostedBy() != userId) {
            throw new RuntimeException("Unauthorized to update application");
        }

        application.setStatus(status);
        applicationRepository.save(application);

        return ApiResponse.success("Status updated", null);
    }

    private JobAppResponse mapToResponse(JobApplication application) {
        ApiResponse<UserDTO> userResponse = userServiceClient.getUserById(application.getUserId());
        ApiResponse<JobDTO> jobResponse = jobServiceClient.getJobById(application.getJobId());

        JobAppResponse response = new JobAppResponse();
        response.setApplicationId(application.getId());
        response.setUser(userResponse.getData());
        response.setJob(jobResponse.getData());
        response.setStatus(application.getStatus());
        response.setAppliedAt(application.getAppliedAt());

        return response;
    }
}
