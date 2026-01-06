package com.example.demo.controller;

import com.example.demo.dto.JobRequest;
import com.example.demo.dto.JobResponse;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.JobService;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor

public class JobController {
    private final JobService jobService;
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createJob(@Valid @RequestBody JobRequest request)
    {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobService.createJob(request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<JobResponse>>> getAllJobs()
    {
        return ResponseEntity.ok(jobService.getAllJobs());
    }
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<JobResponse>>> searchJob(@RequestParam(required=false) String keyword, @RequestParam(required=false) String location, @RequestParam(defaultValue = "0")int page, @RequestParam(defaultValue = "5") int size,@RequestParam(defaultValue = "createdAt") String sortBy, @RequestParam(defaultValue = "desc") String direction)
    {
        return ResponseEntity.ok(jobService.searchJob(keyword,location,page, size,sortBy,direction));
    }

    @GetMapping("/{job_id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(@PathVariable int job_id)
    {
        return ResponseEntity.ok(jobService.getJobById(job_id));
    }
    @DeleteMapping("/{job_id}")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable int job_id)
    {
        return ResponseEntity.ok(jobService.deleteJob(job_id));
    }
}