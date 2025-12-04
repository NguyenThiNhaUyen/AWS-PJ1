package com.metro.metropolitano.service;


import com.metro.metropolitano.dto.ScheduleDTO;
import com.metro.metropolitano.model.Trip;
import com.metro.metropolitano.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final TripRepository tripRepo;

    private final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

    public List<ScheduleDTO> getUpcomingSchedules(int limit) {
        List<Trip> trips = tripRepo.findAllUpcoming(PageRequest.of(0, limit));
        return trips.stream().map(t -> ScheduleDTO.builder()
                        .station(t.getLineName().split(" - ")[0])
                        .line(t.getLineName())
                        .status(t.getStatus().name())
                        .time(t.getScheduledDeparture().toLocalTime().format(timeFormatter))
                        .build())
                .toList();
    }

    public List<ScheduleDTO> getSchedulesByLine(String lineName) {
        List<Trip> trips = tripRepo.findByLineName(lineName);
        return trips.stream().map(t -> ScheduleDTO.builder()
                        .station(t.getLineName().split(" - ")[0])
                        .line(t.getLineName())
                        .status(t.getStatus().name())
                        .time(t.getScheduledDeparture().toLocalTime().format(timeFormatter))
                        .build())
                .toList();
    }
}
