package com.metro.metropolitano.repository;

import com.metro.metropolitano.model.TripStop;
import com.metro.metropolitano.model.Trip;
import com.metro.metropolitano.model.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface TripStopRepository extends JpaRepository<TripStop, Long> {

    List<TripStop> findByTripOrderByStopOrderAsc(Trip trip);

    // Các chuyến sắp đến 1 ga cụ thể sau thời điểm now
    List<TripStop> findByStationAndScheduledArrivalAfterOrderByScheduledArrivalAsc(
            Station station,
            LocalDateTime from
    );

    // 🆕 Dùng cho thống kê delay theo ga trong khoảng ngày
    List<TripStop> findByStationAndTrip_ServiceDateBetween(
            Station station,
            LocalDate from,
            LocalDate to
    );

    // ---- Thống kê cho LINE ----
    @Query("""
        SELECT COUNT(ts)
        FROM TripStop ts
        WHERE ts.trip.lineName = :line
          AND ts.scheduledArrival >= :start
          AND ts.scheduledArrival < :end
    """)
    long countStopsForLine(
            @Param("line") String line,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
        SELECT COUNT(ts)
        FROM TripStop ts
        WHERE ts.trip.lineName = :line
          AND ts.scheduledArrival >= :start
          AND ts.scheduledArrival < :end
          AND ts.delayMinutes > 0
    """)
    long countDelayedStopsForLine(
            @Param("line") String line,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
        SELECT MAX(ts.delayMinutes)
        FROM TripStop ts
        WHERE ts.trip.lineName = :line
          AND ts.scheduledArrival >= :start
          AND ts.scheduledArrival < :end
    """)
    Integer maxDelayForLine(
            @Param("line") String line,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
        SELECT AVG(ts.delayMinutes)
        FROM TripStop ts
        WHERE ts.trip.lineName = :line
          AND ts.scheduledArrival >= :start
          AND ts.scheduledArrival < :end
          AND ts.delayMinutes > 0
    """)
    Double avgDelayForLine(
            @Param("line") String line,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );


    // ---- Thống kê cho STATION ----
    @Query("""
        SELECT COUNT(ts)
        FROM TripStop ts
        WHERE ts.station = :station
          AND ts.scheduledArrival >= :start
          AND ts.scheduledArrival < :end
    """)
    long countStopsForStation(
            @Param("station") com.metro.metropolitano.model.Station station,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
        SELECT COUNT(ts)
        FROM TripStop ts
        WHERE ts.station = :station
          AND ts.scheduledArrival >= :start
          AND ts.scheduledArrival < :end
          AND ts.delayMinutes > 0
    """)
    long countDelayedStopsForStation(
            @Param("station") com.metro.metropolitano.model.Station station,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
        SELECT MAX(ts.delayMinutes)
        FROM TripStop ts
        WHERE ts.station = :station
          AND ts.scheduledArrival >= :start
          AND ts.scheduledArrival < :end
    """)
    Integer maxDelayForStation(
            @Param("station") com.metro.metropolitano.model.Station station,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
        SELECT AVG(ts.delayMinutes)
        FROM TripStop ts
        WHERE ts.station = :station
          AND ts.scheduledArrival >= :start
          AND ts.scheduledArrival < :end
          AND ts.delayMinutes > 0
    """)
    Double avgDelayForStation(
            @Param("station") com.metro.metropolitano.model.Station station,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
