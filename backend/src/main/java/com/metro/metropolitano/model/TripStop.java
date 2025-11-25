package com.metro.metropolitano.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "trip_stops")
@Data
@NoArgsConstructor
public class TripStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mỗi stop thuộc 1 trip
    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    // Ga tương ứng
    @ManyToOne
    @JoinColumn(name = "station_id", nullable = false)
    private Station station;

    // Thứ tự trong chuyến
    @Column(nullable = false)
    private Integer stopOrder;

    // Thời gian dự kiến tới ga
    @Column(nullable = false)
    private LocalDateTime scheduledArrival;

    // Thời gian thực tế (nếu có)
    private LocalDateTime actualArrival;

    // Trễ bao nhiêu phút (nếu có)
    private Integer delayMinutes;
}
