package com.apnabank.controller;

import com.apnabank.dto.auth.AuthResponse;
import com.apnabank.dto.auth.LoginRequest;
import com.apnabank.dto.auth.RegisterRequest;
import com.apnabank.dto.auth.VerifyOtpRequest;
import com.apnabank.dto.common.ApiResponse;
import com.apnabank.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success(response, "User registered successfully. OTP sent to email."));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        AuthResponse response = authService.login(request);
        String message = response.isMfaRequired() 
                ? "OTP sent to your registered email." 
                : "Login successful.";
        return ResponseEntity.ok(ApiResponse.success(response, message));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request
    ) {
        AuthResponse response = authService.verifyOtp(request);
        return ResponseEntity.ok(ApiResponse.success(response, "OTP verified successfully."));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("email", userDetails.getUsername());
        userInfo.put("role", userDetails.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority().replace("ROLE_", ""))
                .orElse("USER"));
        
        return ResponseEntity.ok(ApiResponse.success(userInfo, "User details retrieved successfully"));
    }
    
    /**
     * Health check endpoint to verify API is accessible
     * @return A simple health status message
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("message", "Auth service is running");
        status.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(ApiResponse.success(status, "API is operational"));
    }
} 