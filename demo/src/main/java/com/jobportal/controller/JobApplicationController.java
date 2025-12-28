package com.jobportal.controller;

import com.jobportal.dto.ApplicationResponse;
import com.jobportal.dto.ApplyJobRequest;
import com.jobportal.dto.UpdateStatusRequest;
import com.jobportal.response.ApiResponse;
import com.jobportal.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ApiResponse<String>> applyJob(
            @RequestBody ApplyJobRequest request) {
        return ResponseEntity.ok(applicationService.applyForJob(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getByUser(
            @PathVariable Long userId) {
        return ResponseEntity.ok(applicationService.getApplicationsByUser(userId));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getByJob(
            @PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJob(jobId));
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<ApiResponse<String>> updateStatus(
            @PathVariable Long applicationId,
            @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok(
                applicationService.updateStatus(applicationId, request));
    }
}
