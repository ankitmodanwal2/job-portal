package com.jobportal.job.controller;

import com.jobportal.common.dto.ApiResponse;
import com.jobportal.job.dto.JobRequest;
import com.jobportal.job.dto.JobResponse;
import com.jobportal.job.service.JobService;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<ApiResponse<Void>> createJob(
            @RequestBody JobRequest request,
            @RequestHeader("X-User-Id") int userId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(jobService.createJob(request, userId));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<JobResponse>>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(@PathVariable int jobId) {
        return ResponseEntity.ok(jobService.getJobById(jobId));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<ApiResponse<Void>> deleteJob(
            @PathVariable int jobId,
            @RequestHeader("X-User-Id") int userId) {
        return ResponseEntity.ok(jobService.deleteJob(jobId, userId));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<JobResponse>>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        return ResponseEntity.ok(jobService.searchJobs(keyword, location, page, size, sortBy, direction));
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getMyJobs(
            @RequestHeader("X-User-Id") int userId) {
        return ResponseEntity.ok(jobService.getJobsByUser(userId));
    }
}