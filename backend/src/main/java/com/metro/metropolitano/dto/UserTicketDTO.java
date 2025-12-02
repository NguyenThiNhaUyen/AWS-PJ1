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
public class UserTicketDTO {

    private Long id;
    private String ticketTypeName;
    private String startStation;
    private String endStation;
    private Long price;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime activationTime;
    private LocalDateTime expirationTime;
}
