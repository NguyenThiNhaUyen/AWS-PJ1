package com.metro.metropolitano.dto;

import com.metro.metropolitano.enums.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TripSummaryDto {
    private Long id;
    private String lineName;
    private String direction;
    private LocalDate serviceDate;
    private LocalDateTime scheduleDeparture;
    private LocalDateTime actualDeparture;
    private TripStatus tripStatus;
}
