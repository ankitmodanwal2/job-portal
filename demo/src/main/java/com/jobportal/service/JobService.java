package com.jobportal.service;

import com.jobportal.dto.JobRequest;
import com.jobportal.dto.JobResponse;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApiResponse<JobResponse> createJob(JobRequest request) {

        User employer = userRepository.findById(request.getEmployerId())
                .orElseThrow(()-> new ResourceNotFoundException("Employee not found"));

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setCompanyName(request.getCompanyName());
        job.setSalary(request.getSalary());
        job.setJobType(request.getJobType());
        job.setPostedBy(employer);
        job.setCreatedAt(LocalDateTime.now());

        Job savedJob = jobRepository.save(job);

        return ApiResponse.success("Job created successfully", mapToResponse(savedJob) );


    }

    public ApiResponse<List<JobResponse>> getAllJobs() {
       List<JobResponse> jobs = jobRepository.findAll()
               .stream()
               .map(this::mapToResponse)//.map(job -> mapToResponse(job))
               .toList();
       return ApiResponse.success("Jobs fetched successfully", jobs);
    }

    public ApiResponse<JobResponse> getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        return ApiResponse.success("Job fetched successfully", mapToResponse(job));

    }

    public ApiResponse<List<JobResponse>> searchJobs(String keyword, String location) {

        List<Job> jobs;

        if(keyword !=null && location != null) {
            jobs = jobRepository.findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(keyword, location);
        }
        else if(keyword != null) {
            jobs = jobRepository.findByTitleContainingIgnoreCase(keyword);
        }
        else if(location != null) {
            jobs = jobRepository.findByLocationContainingIgnoreCase(location);
        }
        else{
            jobs = jobRepository.findAll();
        }
        return ApiResponse.success("Jobs fetched successfully", jobs.stream().map(this::mapToResponse).toList());
    }

    private JobResponse mapToResponse(Job job) {
        JobResponse jobResponse = new JobResponse();
        jobResponse.setId(job.getId());
        jobResponse.setTitle(job.getTitle());
        jobResponse.setDescription(job.getDescription());
        jobResponse.setLocation(job.getLocation());
        jobResponse.setCompanyName(job.getCompanyName());
        jobResponse.setSalary(job.getSalary());
        jobResponse.setJobType(job.getJobType());
        jobResponse.setPostedBy(job.getPostedBy().getName());
        jobResponse.setCreatedAt(job.getCreatedAt());
        return jobResponse;

    }
}
