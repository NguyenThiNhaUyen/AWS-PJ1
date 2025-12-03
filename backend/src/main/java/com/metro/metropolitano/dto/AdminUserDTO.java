package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private String status;
    private LocalDateTime createdAt;
}
