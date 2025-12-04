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
public class AdminTicketDTO {
    private Long id;
    private String username;
    private String fullname;
    private String route;
    private String ticketType;
    private Double price;
    private String status;
    private LocalDateTime purchaseDate;
}
