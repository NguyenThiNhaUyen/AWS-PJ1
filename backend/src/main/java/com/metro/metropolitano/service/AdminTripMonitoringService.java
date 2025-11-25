package com.metro.metropolitano.service;

import com.metro.metropolitano.dto.AdminTripMonitorDto;
import com.metro.metropolitano.enums.TripStatus;
import com.metro.metropolitano.model.Trip;
import com.metro.metropolitano.model.TripStop;
import com.metro.metropolitano.repository.TripRepository;
import com.metro.metropolitano.repository.TripStopRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminTripMonitoringService {

    private final TripRepository tripRepository;
    private final TripStopRepository tripStopRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public AdminTripMonitorDto updateTripStatus(Long tripId, TripStatus newStatus) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found: " + tripId));

        trip.setStatus(newStatus);
        tripRepository.save(trip);

        AdminTripMonitorDto dto = toMonitorDto(trip);

        // broadcast lên WS theo tuyến
        String destination = "/topic/trips/" + trip.getLineName();
        messagingTemplate.convertAndSend(destination, dto);

        return dto;
    }


    public List<AdminTripMonitorDto> monitorTrips(String lineName,
                                                  LocalDate date,
                                                  List<TripStatus> statuses) {

        List<Trip> trips;

        if (statuses == null || statuses.isEmpty()) {
            trips = tripRepository
                    .findByLineNameAndServiceDateOrderByScheduledDepartureAsc(lineName, date);
        } else {
            trips = tripRepository
                    .findByLineNameAndServiceDateAndStatusInOrderByScheduledDepartureAsc(
                            lineName, date, statuses
                    );
        }

        return trips.stream()
                .map(this::toMonitorDto)
                .toList();
    }

    private AdminTripMonitorDto toMonitorDto(Trip t) {
        List<TripStop> stops = tripStopRepository.findByTripOrderByStopOrderAsc(t);

        int maxDelay = stops.stream()
                .map(s -> s.getDelayMinutes() == null ? 0 : s.getDelayMinutes())
                .max(Integer::compareTo)
                .orElse(0);

        return new AdminTripMonitorDto(
                t.getId(),
                t.getLineName(),
                t.getDirection(),
                t.getServiceDate(),
                t.getScheduledDeparture(),
                t.getActualDeparture(),
                t.getStatus(),
                maxDelay,
                null // issueReason – sau này bạn map từ bảng issue riêng
        );
    }
}
