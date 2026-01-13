package com.jobportal.application.feign;

import com.jobportal.common.dto.ApiResponse;
import com.jobportal.common.dto.JobDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "job-service")
public interface JobServiceClient {
    @GetMapping("/api/jobs/{jobId}")
    ApiResponse<JobDTO> getJobById(@PathVariable("jobId") int jobId);
}