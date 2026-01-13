package com.jobportal.user.service;

import com.jobportal.common.dto.ApiResponse;
import com.jobportal.common.exception.ResourceNotFoundException;
import com.jobportal.user.config.JwtUtil;
import com.jobportal.user.dto.LoginRequest;
import com.jobportal.user.dto.SignupRequest;
import com.jobportal.user.dto.UserResponse;
import com.jobportal.user.model.User;
import com.jobportal.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public ApiResponse<String> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect password");
        }

        String token = jwtUtil.generateToken(user);
        return ApiResponse.success("Login successful", token);
    }

    public ApiResponse<Void> signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);

        return ApiResponse.success("Signup successful", null);
    }

    public ApiResponse<UserResponse> getUserById(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserResponse response = new UserResponse();
        response.setUserId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());

        return ApiResponse.success("User fetched", response);
    }

    public ApiResponse<UserResponse> getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserResponse response = new UserResponse();
        response.setUserId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());

        return ApiResponse.success("User fetched", response);
    }
}