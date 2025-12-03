package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsDTO {
    private long totalTickets;
    private long activeTickets;
    private long usedTickets;
    private Double totalSpent;
}
