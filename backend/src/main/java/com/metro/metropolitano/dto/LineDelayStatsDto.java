package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LineDelayStatsDto {
    private String lineName;
    private long totalStops;
    private long delayedStops;
    private double avgDelayMinutes;   // trung bình của các stop có delay > 0
    private int maxDelayMinutes;
}
