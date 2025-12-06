package com.metro.metropolitano.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.metro.metropolitano.dto.AccountResponse;
import com.metro.metropolitano.dto.ChangePasswordRequest;
import com.metro.metropolitano.dto.UpdateProfileRequest;
import com.metro.metropolitano.service.AccountService;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping("/me")
    public ResponseEntity<AccountResponse> me(@AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        AccountResponse resp = accountService.getAccountByUsername(userDetails.getUsername());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<AccountResponse> getByUsername(@PathVariable String username) {
        return ResponseEntity.ok(accountService.getAccountByUsername(username));
    }

    @PutMapping("/profile")
    public ResponseEntity<AccountResponse> updateProfile(@AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails,
            @RequestBody UpdateProfileRequest req) {
        AccountResponse resp = accountService.updateProfile(userDetails.getUsername(), req);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails,
            @RequestBody ChangePasswordRequest req) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        // Validate confirm password
        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("New password and confirm password do not match");
        }

        try {
            accountService.changePassword(userDetails.getUsername(), req.getCurrentPassword(), req.getNewPassword());
            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
