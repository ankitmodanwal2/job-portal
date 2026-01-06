package com.example.demo.service;

import com.example.demo.config.JwtUtil;
import com.example.demo.dto.JobRequest;
import com.example.demo.exception.EmailAlreadyExistsException;
import com.example.demo.exception.IncorrectPasswordException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Job;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.SignupRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.model.User;
import com.example.demo.repository.JobRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;


import java.time.LocalDateTime;
import java.util.Optional;

@Component
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;


    public ApiResponse<String> Login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not registered for this email"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IncorrectPasswordException("Password incorrect");
        }
        String token = jwtUtil.generateToken(user);
        return ApiResponse.success("Login successful", token);


    }


    public ApiResponse<Void> SignUp(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("this email is already registered ");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setCreatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);
        return ApiResponse.success("Signup successful", null);
    }


    public ApiResponse<UserResponse> getUserByID(int id) {
        User user;

        Optional<User> userContainer = userRepository.findById(id);
        if (userContainer.isPresent()) {
            user = userContainer.get();
            UserResponse userResponse = new UserResponse();
            userResponse.setUserId(user.getId());
            userResponse.setName(user.getName());
            userResponse.setEmail(user.getEmail());
            userResponse.setRole(user.getRole());
            return ApiResponse.success("User fetched successfully", userResponse);
        }
        else
        {
            throw new ResourceNotFoundException("user not found for that id");
        }
    }


}
