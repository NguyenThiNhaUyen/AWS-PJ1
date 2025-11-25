package com.metro.metropolitano.service;

import com.metro.metropolitano.dto.StationArrivalDto;
import com.metro.metropolitano.dto.TripStopDto;
import com.metro.metropolitano.dto.TripSummaryDto;
import com.metro.metropolitano.model.*;
import com.metro.metropolitano.repository.StationRepository;
import com.metro.metropolitano.repository.TripRepository;
import com.metro.metropolitano.repository.TripStopRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final TripStopRepository tripStopRepository;
    private final StationRepository stationRepository;

//    @Transactional
//    public List<Trip> findTrip(Long tripId){
//        Trip trip = tripRepository.findById(tripId).orElseThrow(() -> new RuntimeException("Trip not found " + tripId));
//
//        return tripR
//    }



    @Transactional
    public List<TripSummaryDto> findTrips(String lineName, LocalDate date){
        return tripRepository.findByLineNameAndServiceDateOrderByScheduledDepartureAsc(lineName, date).stream().map(this::toSummaryDto).toList();
    }

    public TripSummaryDto getTrip(Long id){
        Trip trip =  tripRepository.findById(id).orElseThrow(() -> new RuntimeException("Trip not found " + id));
        return toSummaryDto(trip);
    }

    /**
     * Tìm danh sách trip theo line + ngày
     */
//    @Transactional
//    public List<Trip> findTrips(String lineName, LocalDate date) {
//        return tripRepository.findByLineNameAndServiceDateOrderByScheduledDepartureAsc(lineName, date);
//    }

    /**
     * Xem lịch trình chi tiết của 1 trip (danh sách stop)
     * /api/trips/{id}/stops
     */
    @Transactional
    public List<TripStopDto> getTripStops(Long tripId){
        Trip trip = tripRepository.findById(tripId).orElseThrow(() -> new RuntimeException("Trip not found " + tripId));

        return tripStopRepository.findByTripOrderByStopOrderAsc(trip).stream().map(this::toStopDto).toList();
    }
//    @Transactional
//    public List<TripStop> getTripStops(Long tripId) {
//        Trip trip = tripRepository.findById(tripId)
//                .orElseThrow(() -> new RuntimeException("Trip not found: " + tripId));
//
//        return tripStopRepository.findByTripOrderByStopOrderAsc(trip);
//    }

    /**
     *
     * @param stationName
     * @param limit
     * @return
     * /api/stations/{name}/arrivals?limit=5
     */

    @Transactional
    public List<StationArrivalDto> getUpcomingArrivals(String stationName, int limit){
        Station st = stationRepository.findByName(stationName).orElseThrow(() -> new RuntimeException("Station not found " + stationName));

        LocalDateTime now = LocalDateTime.now();
        List<TripStop> stops = tripStopRepository.findByStationAndScheduledArrivalAfterOrderByScheduledArrivalAsc(st, now);

        if(stops.size() > limit){
            stops = stops.subList(0, limit);
        }
        return stops.stream().map(this::toArrivalDto).toList();
    }

    /**
     * Lấy các chuyến sắp đến 1 ga sau thời điểm now
     */
    @Transactional
    public List<TripStop> getUpcomingArrivalsAtStation(String stationName, int limit) {
        Station station = stationRepository.findByName(stationName)
                .orElseThrow(() -> new RuntimeException("Station not found: " + stationName));

        LocalDateTime now = LocalDateTime.now();
        List<TripStop> stops = tripStopRepository
                .findByStationAndScheduledArrivalAfterOrderByScheduledArrivalAsc(station, now);

        if (stops.size() > limit) {
            return stops.subList(0, limit);
        }
        return stops;
    }

    private TripSummaryDto toSummaryDto(Trip t){
        return new TripSummaryDto(
                t.getId(),
                t.getLineName(),
                t.getDirection(),
                t.getServiceDate(),
                t.getScheduledDeparture(),
                t.getActualDeparture(),
                t.getStatus()
        );
    }

    private TripStopDto toStopDto(TripStop t){
        return new TripStopDto(
                t.getStopOrder(),
                t.getStation().getName(),
                t.getScheduledArrival(),
                t.getActualArrival(),
                t.getDelayMinutes()
        );
    }

    private StationArrivalDto toArrivalDto(TripStop s){
        Trip t = s.getTrip();
        return new StationArrivalDto(
                t.getId(),
                t.getLineName(),
                t.getDirection(),
                t.getServiceDate(),
                s.getStation().getName(),
                s.getScheduledArrival(),
                s.getActualArrival(),
                s.getDelayMinutes(),
                t.getStatus()
        );
    }
}
