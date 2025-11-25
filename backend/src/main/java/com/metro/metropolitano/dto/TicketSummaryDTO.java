package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TicketSummaryDTO {

    private Long id;
    private String ticketTypeName;
    private String startStationName;
    private String endStationName;
    private Double price;
    private String status;
    private LocalDateTime activationTime;
    private LocalDateTime expirationTime;
}
