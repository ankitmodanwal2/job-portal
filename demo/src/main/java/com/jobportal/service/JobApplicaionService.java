package com.jobportal.service;

import com.jobportal.dto.ApplicationResponse;
import com.jobportal.dto.ApplyJobRequest;
import com.jobportal.dto.JobResponse;
import com.jobportal.dto.UpdateStatusRequest;
import com.jobportal.entity.Job;
import com.jobportal.entity.JobApplication;
import com.jobportal.entity.User;
import com.jobportal.enums.ApplicationStatus;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.JobApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobApplicaionService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApiResponse<Void> apply(ApplyJobRequest request) {
        if(jobApplicationRepository.existsByJobIdAndUserId(request.getJobId(), request.getUserId())) {
            throw new RuntimeException("Already applied for this job");
        }
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        JobApplication jobApplication = new JobApplication();
        jobApplication.setJob(jobRepository.getById(request.getJobId()));
        jobApplication.setUser(userRepository.getById(request.getUserId()));
        jobApplication.setStatus(ApplicationStatus.APPLIED);
        jobApplication.setAppliedAt(LocalDateTime.now());

        jobApplicationRepository.save(jobApplication);
        return ApiResponse.success("Job applied successfully", null);
    }
    public ApiResponse<List<ApplicationResponse>> getApplicationByUser(Long userId) {

        List<ApplicationResponse> responses = jobApplicationRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
        return ApiResponse.success("List of applications fetched successfully", responses);
    }
    public ApplicationResponse mapToResponse(JobApplication jobApplication) {

        ApplicationResponse applicationResponse = new ApplicationResponse();
        applicationResponse.setApplicationId(jobApplication.getId());
        applicationResponse.setJobTitle(jobApplication.getJob().getTitle());
        applicationResponse.setCompanyName(jobApplication.getJob().getCompanyName());
        applicationResponse.setApplicantName(jobApplication.getUser().getName());
        applicationResponse.setStatus(jobApplication.getStatus());
        applicationResponse.setAppliedAt(jobApplication.getAppliedAt());
        return applicationResponse;
    }

    public  ApiResponse<List<ApplicationResponse>> getApplicationByJob(Long jobId) {
       List<ApplicationResponse> responses = jobApplicationRepository.findByJobId(jobId)
               .stream()
                .map(this::mapToResponse)
                .toList();
       return ApiResponse.success("List of applications fetched successfully", responses);
    }

    public  ApiResponse<Void> updateStatus(Long applicationId, UpdateStatusRequest request) {

       JobApplication application =  jobApplicationRepository.findById(applicationId).orElseThrow(() -> new ResourceNotFoundException("Application not found"));
       application.setStatus(request.getStatus());
        jobApplicationRepository.save(application);
        return ApiResponse.success("Job updated successfully", null);
    }
}
