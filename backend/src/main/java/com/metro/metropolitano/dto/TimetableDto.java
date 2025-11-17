package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimetableDto {
    private String lineName;              // "Line 1"
    private String type;                  // "weekday" / "weekend"
    private List<TimetableItemDto> items; // danh sách chuyến
}
