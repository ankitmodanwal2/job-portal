package com.example.demo.service;

import com.example.demo.dto.JobRequest;
import com.example.demo.dto.JobResponse;
import com.example.demo.dto.UserResponse;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Job;
import com.example.demo.model.User;
import com.example.demo.repository.JobRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Service
@RequiredArgsConstructor
public class JobService
{
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApiResponse<Void> createJob(JobRequest request) {
        if (jobRepository.existsByTitle(request.getTitle()))
        {
            throw new RuntimeException("Job already created");
        }
        else
        {
            String email = getAuthenticatedUserEmail();
            User user = userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("user does not exist"));
            Job job = new Job();
            job.setTitle(request.getTitle());
            job.setDescription((request.getDescription()));
            job.setLocation(request.getLocation());
            job.setSalary(request.getSalary());
            job.setCompanyName(request.getCompanyName());
            job.setJobType(request.getJobType());
            job.setPostedBy(user);
            job.setCreatedAt(LocalDateTime.now());
            jobRepository.save(job);
            return ApiResponse.success("Job creation successful", null);
        }
    }

    public ApiResponse<List<JobResponse>> getAllJobs() {
        List<JobResponse> jobs = jobRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
        return ApiResponse.success("Jobs fetched successfully", jobs);
    }
    public JobResponse mapToResponse(Job job) {
        return new JobResponse(job.getId(), job.getTitle(), job.getDescription(), job.getLocation(),job.getCompanyName(), job.getSalary(), job.getJobType());

    }

    public ApiResponse<JobResponse> getJobById(int job_id)
    {
        Job job = jobRepository.findJobById(job_id).orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        JobResponse jobResponse = mapToResponse(job);
        return ApiResponse.success("Job Fetched successfully",jobResponse);
    }

    public ApiResponse<Void> deleteJob(int job_id)
    {
        String email = getAuthenticatedUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("user not found"));
        Job job = jobRepository.findJobById(job_id).orElseThrow(() -> new ResourceNotFoundException("No job found for this job_id to be deleted"));
        if(job.getPostedBy().equals(user))
        {
            jobRepository.delete(job);
        }
        else
        {
            throw new ResourceNotFoundException("you are not authorised to delete this job");
        }
        return ApiResponse.success("Job Deleted Successfully",null);
    }

    public ApiResponse<Page<JobResponse>> searchJob(String keyword, String location, int page, int size, String sortBy, String direction)
    {

        Sort.Direction sortDirection =
                direction.equalsIgnoreCase("desc")
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;

        Sort sort = Sort.by(sortDirection, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);


        if(location==null && keyword!=null) {
            Page<JobResponse> jobs = jobRepository.findByTitleContainingIgnoreCase(keyword, pageable)
                    .map(this::mapToResponse);
            return ApiResponse.success("Jobs fetched successfully", jobs);
        }
        else if (keyword==null && location!=null) {
            Page<JobResponse> jobs = jobRepository.findByLocationContainingIgnoreCase(location, pageable)
                    .map(this::mapToResponse);
            return ApiResponse.success("Jobs fetched successfully", jobs);
        }
        else if (keyword!=null && location!=null) {
            Page<JobResponse> jobs = jobRepository.findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(keyword, location, pageable)
                    .map(this::mapToResponse);
            return ApiResponse.success("Jobs fetched successfully", jobs);
        }
        else  {
            Page<JobResponse> jobs = jobRepository.findAll(pageable)
                    .map(this::mapToResponse);


            return ApiResponse.success("Jobs fetched successfully", jobs);
        }


    }
    private String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

}
