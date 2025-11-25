package com.metro.metropolitano.dto;

import com.metro.metropolitano.enums.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AdminTripMonitorDto {
    private Long id;
    private String lineName;
    private String direction;
    private LocalDate serviceDate;

    private LocalDateTime scheduledDeparture;
    private LocalDateTime actualDeparture;

    private TripStatus status;
    private Integer maxDelayMinutes; // delay lớn nhất trong các stop
    private String issueReason;      // nếu sau này bạn thêm bảng issue
}
