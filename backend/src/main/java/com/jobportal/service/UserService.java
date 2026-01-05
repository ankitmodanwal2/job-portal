package com.jobportal.service;

import com.jobportal.dto.LoginRequest;
import com.jobportal.dto.RegisterRequest;
import com.jobportal.entity.User;
import com.jobportal.exception.EmailAlreadyExistsException;
import com.jobportal.exception.InvalidCredentialsException;
import com.jobportal.repository.UserRepository;
import com.jobportal.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public ApiResponse<Void> register(RegisterRequest request) {

        if(userRepository.existsByEmail(request.getEmail())) {
            throw new  EmailAlreadyExistsException("Email already registered");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);
        return ApiResponse.success("User registered successfully", null);
    }
    public ApiResponse<Void> login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));
        if(!request.getPassword().equals(user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return ApiResponse.success("Login successful", null);
    }
}
