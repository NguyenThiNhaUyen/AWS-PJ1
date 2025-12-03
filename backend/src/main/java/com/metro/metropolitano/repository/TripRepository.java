package com.metro.metropolitano.repository;

import com.metro.metropolitano.model.Trip;
import com.metro.metropolitano.enums.TripStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {

    // Tìm chuyến theo line + ngày
    List<Trip> findByLineNameAndServiceDateOrderByScheduledDepartureAsc(
            String lineName,
            LocalDate serviceDate
    );

    // Dùng cho màn monitoring
    List<Trip> findByLineNameAndServiceDateAndStatusInOrderByScheduledDepartureAsc(
            String lineName,
            LocalDate serviceDate,
            List<TripStatus> statuses
    );

    // Tìm các trip đang chạy / sắp tới (vd để tính giờ đến ga)
    List<Trip> findByServiceDateAndStatusInAndScheduledDepartureAfterOrderByScheduledDepartureAsc(
            LocalDate date,
            List<TripStatus> statuses,
            LocalDateTime from
    );

    // 🆕 Dùng cho thống kê delay tuyến trong khoảng ngày
    List<Trip> findByLineNameAndServiceDateBetween(
            String lineName,
            LocalDate from,
            LocalDate to
    );

    @Query("SELECT t FROM Trip t WHERE t.scheduledDeparture > CURRENT_TIMESTAMP ORDER BY t.scheduledDeparture ASC")
    List<Trip> findAllUpcoming(Pageable pageable);

    List<Trip> findByLineName(String lineName);
}
