package com.apnabank.service;

import com.apnabank.dto.auth.AuthResponse;
import com.apnabank.dto.auth.LoginRequest;
import com.apnabank.dto.auth.RegisterRequest;
import com.apnabank.dto.auth.VerifyOtpRequest;
import com.apnabank.model.Role;
import com.apnabank.model.User;
import com.apnabank.repository.UserRepository;
import com.apnabank.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        // Create and save user
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .dateOfBirth(null)
                .idProofType(null)
                .idProofNumber(null)
                .role(request.getRole())
                .mfaEnabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .enabled(true)
                .build();
                
        // Generate OTP for verification
        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(5));
        
        userRepository.save(user);
        
        // Send OTP email
        emailService.sendOtpEmail(user.getEmail(), otp);
        
        return AuthResponse.builder()
                .mfaRequired(true)
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        // Get user from repository
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        
        // If MFA is enabled, generate and send OTP
        if (user.isMfaEnabled()) {
            String otp = generateOtp();
            user.setOtp(otp);
            user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(5));
            userRepository.save(user);
            
            emailService.sendOtpEmail(user.getEmail(), otp);
            
            return AuthResponse.builder()
                    .mfaRequired(true)
                    .build();
        }
        
        // If MFA is not enabled, generate tokens
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .mfaRequired(false)
                .build();
    }

    @Transactional
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        // Find user by email and OTP
        User user = userRepository.findByEmailAndOtp(request.getEmail(), request.getOtp())
                .orElseThrow(() -> new IllegalArgumentException("Invalid OTP"));
        
        // Check if OTP is expired
        if (user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP has expired");
        }
        
        // Clear OTP after verification
        user.setOtp(null);
        user.setOtpExpiryTime(null);
        userRepository.save(user);
        
        // Generate tokens
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        
        // If this is first verification after registration, send welcome email
        if (user.getOtpExpiryTime() != null) {
            emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName());
        }
        
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .mfaRequired(false)
                .build();
    }
    
    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000); // 6-digit OTP
        return String.valueOf(otp);
    }
} 