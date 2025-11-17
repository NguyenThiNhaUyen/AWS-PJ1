package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimetableItemDto {
    private String departureTime; // "06:00"
    private String arrivalTime;   // "06:35" (có thể null)
    private String fromStation;   // "Ben Thanh"
    private String toStation;     // "BX Suoi Tien"
}
