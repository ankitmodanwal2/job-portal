package com.example.demo.controller;


import com.example.demo.dto.JobRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.repository.UserRepository;
import com.example.demo.response.ApiResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.SignupRequest;
import com.example.demo.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private final UserService userService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>>login(@Valid @RequestBody LoginRequest request) {


        return ResponseEntity.status(HttpStatus.OK).body(userService.Login(request));

    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> SignUp(@Valid @RequestBody SignupRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED).body(userService.SignUp(request));

    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserByID(@PathVariable int id )
    {
        return ResponseEntity.ok(userService.getUserByID(id));
    }

}