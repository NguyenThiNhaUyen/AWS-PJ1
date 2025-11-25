package com.metro.metropolitano.service;

import com.metro.metropolitano.dto.LineDelayStatsDto;
import com.metro.metropolitano.dto.StationDelayStatsDto;
import com.metro.metropolitano.model.Station;
import com.metro.metropolitano.model.TripStop;
import com.metro.metropolitano.repository.StationRepository;
import com.metro.metropolitano.repository.TripStopRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DelayStatsService {

    private final TripStopRepository statsRepo;
    private final StationRepository stationRepository;

    // ---------------- LINE ----------------
    public LineDelayStatsDto lineDelayStats(String lineName,
                                            LocalDate from,
                                            LocalDate to) {

        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = to.plusDays(1).atStartOfDay();

        long totalStops = statsRepo.countStopsForLine(lineName, start, end);
        long delayedStops = statsRepo.countDelayedStopsForLine(lineName, start, end);
        Integer maxDelay = statsRepo.maxDelayForLine(lineName, start, end);
        Double avgDelay = statsRepo.avgDelayForLine(lineName, start, end);

        return new LineDelayStatsDto(
                lineName,
                totalStops,
                delayedStops,
                avgDelay == null ? 0 : avgDelay,
                maxDelay == null ? 0 : maxDelay
        );
    }

    // ---------------- STATION ----------------
    public StationDelayStatsDto stationDelayStats(String stationName,
                                                  LocalDate from,
                                                  LocalDate to) {

        Station station = stationRepository.findByName(stationName)
                .orElseThrow(() -> new RuntimeException("Station not found: " + stationName));

        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = to.plusDays(1).atStartOfDay();

        long totalStops = statsRepo.countStopsForStation(station, start, end);
        long delayedStops = statsRepo.countDelayedStopsForStation(station, start, end);
        Integer maxDelay = statsRepo.maxDelayForStation(station, start, end);
        Double avgDelay = statsRepo.avgDelayForStation(station, start, end);

        return new StationDelayStatsDto(
                stationName,
                totalStops,
                delayedStops,
                avgDelay == null ? 0 : avgDelay,
                maxDelay == null ? 0 : maxDelay
        );
    }

//    /**
//     * Thống kê delay cho 1 tuyến trong khoảng ngày
//     */
//    public LineDelayStatsDto lineDelayStats(String lineName, LocalDate from, LocalDate to) {
//        LocalDateTime start = from.atStartOfDay();
//        LocalDateTime end = to.plusDays(1).atStartOfDay();
//
//        // lấy toàn bộ TripStop thuộc các trip có lineName & nằm trong khoảng thời gian
//        List<TripStop> stops = tripStopRepository.findAll().stream()
//                .filter(s -> s.getTrip().getLineName().equals(lineName))
//                .filter(s -> {
//                    LocalDateTime t = s.getScheduledArrival();
//                    return (t.isEqual(start) || t.isAfter(start)) && t.isBefore(end);
//                })
//                .toList();
//
//        long total = stops.size();
//        long delayed = stops.stream()
//                .filter(s -> s.getDelayMinutes() != null && s.getDelayMinutes() > 0)
//                .count();
//
//        int maxDelay = stops.stream()
//                .map(s -> s.getDelayMinutes() == null ? 0 : s.getDelayMinutes())
//                .max(Integer::compareTo)
//                .orElse(0);
//
//        double avgDelay = stops.stream()
//                .filter(s -> s.getDelayMinutes() != null && s.getDelayMinutes() > 0)
//                .mapToInt(TripStop::getDelayMinutes)
//                .average()
//                .orElse(0);
//
//        return new LineDelayStatsDto(
//                lineName,
//                total,
//                delayed,
//                avgDelay,
//                maxDelay
//        );
//    }
//
//    /**
//     * Thống kê delay cho 1 ga trong khoảng ngày
//     */
//    public StationDelayStatsDto stationDelayStats(String stationName, LocalDate from, LocalDate to) {
//        Station station = stationRepository.findByName(stationName)
//                .orElseThrow(() -> new RuntimeException("Station not found: " + stationName));
//
//        LocalDateTime start = from.atStartOfDay();
//        LocalDateTime end = to.plusDays(1).atStartOfDay();
//
//        List<TripStop> stops = tripStopRepository
//                .findByStationAndScheduledArrivalAfterOrderByScheduledArrivalAsc(station, start)
//                .stream()
//                .filter(s -> s.getScheduledArrival().isBefore(end))
//                .toList();
//
//        long total = stops.size();
//        long delayed = stops.stream()
//                .filter(s -> s.getDelayMinutes() != null && s.getDelayMinutes() > 0)
//                .count();
//
//        int maxDelay = stops.stream()
//                .map(s -> s.getDelayMinutes() == null ? 0 : s.getDelayMinutes())
//                .max(Integer::compareTo)
//                .orElse(0);
//
//        double avgDelay = stops.stream()
//                .filter(s -> s.getDelayMinutes() != null && s.getDelayMinutes() > 0)
//                .mapToInt(TripStop::getDelayMinutes)
//                .average()
//                .orElse(0);
//
//        return new StationDelayStatsDto(
//                stationName,
//                total,
//                delayed,
//                avgDelay,
//                maxDelay
//        );
//    }
}
