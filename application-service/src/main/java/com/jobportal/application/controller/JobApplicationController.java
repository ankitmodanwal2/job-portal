package com.jobportal.application.controller;

import com.jobportal.application.dto.JobAppRequest;
import com.jobportal.application.dto.JobAppResponse;
import com.jobportal.application.service.JobApplicationService;
import com.jobportal.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {
    private final JobApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> apply(
            @RequestBody JobAppRequest request,
            @RequestHeader("X-User-Id") int userId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(applicationService.apply(request, userId));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<ApiResponse<List<JobAppResponse>>> getMyApplications(
            @RequestHeader("X-User-Id") int userId) {
        return ResponseEntity.ok(applicationService.getApplicationsByUser(userId));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<ApiResponse<Page<JobAppResponse>>> getApplicationsByJob(
            @PathVariable int jobId,
            @RequestHeader("X-User-Id") int userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "appliedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        return ResponseEntity.ok(
                applicationService.getApplicationsByJob(jobId, userId, page, size, sortBy, direction));
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<ApiResponse<Void>> updateStatus(
            @PathVariable int applicationId,
            @RequestParam String status,
            @RequestHeader("X-User-Id") int userId) {
        return ResponseEntity.ok(applicationService.updateStatus(applicationId, status, userId));
    }
}