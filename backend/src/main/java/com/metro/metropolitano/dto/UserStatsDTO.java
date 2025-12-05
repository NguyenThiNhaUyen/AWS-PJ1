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
    private Long totalTickets;
    private Long activeTickets;
    private Long usedTickets;
    private Double totalSpent;
}
