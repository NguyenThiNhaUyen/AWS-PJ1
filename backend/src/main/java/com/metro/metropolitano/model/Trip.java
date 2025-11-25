package com.metro.metropolitano.model;

import com.metro.metropolitano.enums.TripStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
@Data
@NoArgsConstructor
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tuyến – dùng lineName giống Station để đơn giản (vd: "Line 1")
    @Column(nullable = false)
    private String lineName;

    // Hướng: "A_TO_B" hoặc "B_TO_A" (đơn giản dùng string)
    @Column(nullable = false)
    private String direction;

    // Ngày chạy
    @Column(nullable = false)
    private LocalDate serviceDate;

    // Thời gian khởi hành dự kiến tại ga đầu
    @Column(nullable = false)
    private LocalDateTime scheduledDeparture;

    // Thời gian khởi hành thực tế (nếu có)
    private LocalDateTime actualDeparture;

    // Trạng thái
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TripStatus status = TripStatus.SCHEDULED;

    // Nếu đây là chuyến thay thế cho 1 chuyến khác
    @ManyToOne
    @JoinColumn(name = "replaced_trip_id")
    private Trip replacedTrip;
}
