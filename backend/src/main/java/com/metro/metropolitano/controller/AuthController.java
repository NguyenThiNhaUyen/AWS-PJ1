package com.metro.metropolitano.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.metro.metropolitano.dto.LoginRequest;
import com.metro.metropolitano.dto.LoginResponse;
import com.metro.metropolitano.dto.RegisterRequest;
import com.metro.metropolitano.service.AccountService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(accountService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse resp = accountService.login(request);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody com.metro.metropolitano.dto.ForgotPasswordRequest req) {
        boolean ok = accountService.requestPasswordReset(req);
        return ResponseEntity.ok().body(java.util.Map.of("ok", ok));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody com.metro.metropolitano.dto.ResetPasswordRequest req) {
        boolean ok = accountService.resetPassword(req);
        return ResponseEntity.ok().body(java.util.Map.of("ok", ok));
    }
}
