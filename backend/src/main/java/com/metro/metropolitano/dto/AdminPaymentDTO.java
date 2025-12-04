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
public class AdminPaymentDTO {
    private Long id;
    private String transactionId;
    private Long ticketId;
    private String username;
    private Double amount;
    private String method;
    private String status;
    private LocalDateTime timestamp;
}
