package com.metro.metropolitano.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@Builder
public class UserStatsDTO {

    private long totalTickets;
    private long activeTickets;
    private long usedTickets;
    private Double totalSpent;

    public UserStatsDTO(Long totalTickets, Long activeTickets, Long usedTickets, Double totalSpent) {
        this.totalTickets = totalTickets == null ? 0 : totalTickets;
        this.activeTickets = activeTickets == null ? 0 : activeTickets;
        this.usedTickets = usedTickets == null ? 0 : usedTickets;
        this.totalSpent = totalSpent == null ? 0 : totalSpent;
    }
}
