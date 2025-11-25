package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TripStopDto {
    private Integer stopOrder;
    private String stopName;
    private LocalDateTime scheduleDeparture;
    private LocalDateTime actualDeparture;
    private Integer delayMinutes;
}
