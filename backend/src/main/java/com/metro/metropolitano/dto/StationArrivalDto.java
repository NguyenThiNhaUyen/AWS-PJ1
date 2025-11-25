package com.metro.metropolitano.dto;

import com.metro.metropolitano.enums.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class StationArrivalDto {
    private Long tripId;
    private String lineName;
    private String direction;
    private LocalDate serviceDate;

    private String stationName;
    private LocalDateTime scheduledArrival;
    private LocalDateTime actualArrival;
    private Integer delayMinutes;

    private TripStatus status;
}
