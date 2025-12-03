package com.metro.metropolitano.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteStatsDTO {
    private String lineName;
    private int stationCount;
    private int ticketsSold;
    private long revenue;
    private String status;
}
