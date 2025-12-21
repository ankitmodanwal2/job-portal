package com.jobportal.controller;

import com.jobportal.dto.ApplicationResponse;
import com.jobportal.dto.ApplyJobRequest;
import com.jobportal.dto.UpdateStatusRequest;
import com.jobportal.response.ApiResponse;
import com.jobportal.service.JobApplicaionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicaionService jobApplicaionService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> apply(@RequestBody ApplyJobRequest request) {
        return ResponseEntity.ok(jobApplicaionService.apply(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(jobApplicaionService.getApplicationByUser(userId));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(jobApplicaionService.getApplicationByJob(jobId));
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<ApiResponse<Void>> updateStatus(@PathVariable Long applicationId, @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok(jobApplicaionService.updateStatus(applicationId, request));
    }
}
