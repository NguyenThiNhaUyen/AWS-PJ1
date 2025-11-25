package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StationDelayStatsDto {
    private String stationName;
    private long totalStops;
    private long delayedStops;
    private double avgDelayMinutes;
    private int maxDelayMinutes;
}
