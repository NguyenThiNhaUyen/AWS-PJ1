package com.metro.metropolitano.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.metro.metropolitano.enums.TripStatus;
import com.metro.metropolitano.model.Station;
import com.metro.metropolitano.model.Trip;
import com.metro.metropolitano.model.TripStop;
import com.metro.metropolitano.repository.StationRepository;
import com.metro.metropolitano.repository.TripRepository;
import com.metro.metropolitano.repository.TripStopRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@Transactional
public class TripSeeder implements CommandLineRunner {

    private final TripRepository tripRepository;
    private final TripStopRepository tripStopRepository;
    private final StationRepository stationRepository;

    @Override
    public void run(String... args) {

        if (tripRepository.count() > 0) {
            System.out.println("TripSeeder: trips already exist → SKIP");
            return;
        }

        System.out.println("=== TripSeeder: START ===");

        // Seed trips cho hôm nay và ngày mai
        seedLineTrips();

        System.out.println("=== TripSeeder DONE ===");
    }

    private void seedLineTrips() {

        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);

        Map<String, List<String>> metroLines = new LinkedHashMap<>();
        // Chỉ có Line 1: Bến Thành - Suối Tiên
        metroLines.put("Line 1", Arrays.asList(
                "Ben Thanh", "Nha Hat TP", "Ba Son", "Van Thanh", "Tan Cang",
                "Thao Dien", "An Phu", "Rach Chiec", "Phuoc Long", "Binh Thai",
                "Thu Duc", "Khu CNC", "DH Quoc Gia", "BX Suoi Tien"
        ));

        metroLines.forEach((lineName, stationNames) -> {
            System.out.println("Seeding trips for: " + lineName);

            // Load Station từ DB theo tên
            List<Station> stations = new ArrayList<>();
            for (String s : stationNames) {
                stationRepository.findByName(s).ifPresent(stations::add);
            }

            if (stations.isEmpty()) {
                return;
            }

            // Tạo trips cho hôm nay - mỗi 15 phút từ 6:00 đến 23:00
            seedTripsForDay(today, lineName, stations);

            // Tạo trips cho ngày mai
            seedTripsForDay(tomorrow, lineName, stations);
        });
    }

    private void seedTripsForDay(LocalDate date, String lineName, List<Station> stations) {
        // Tạo trips từ 6:00 AM đến 11:00 PM, mỗi 15 phút
        for (int hour = 6; hour < 23; hour++) {
            for (int minute = 0; minute < 60; minute += 15) {
                // Direction A to B
                Trip tripAB = createTrip(lineName, date, hour, minute, TripStatus.SCHEDULED, "A_TO_B");
                createTripStops(tripAB, stations, hour * 60 + minute, 0);

                // Direction B to A (reverse stations)
                Trip tripBA = createTrip(lineName, date, hour, minute, TripStatus.SCHEDULED, "B_TO_A");
                List<Station> reversedStations = new ArrayList<>(stations);
                Collections.reverse(reversedStations);
                createTripStops(tripBA, reversedStations, hour * 60 + minute, 0);
            }
        }
    }

    private Trip createTrip(String line, LocalDate date, int hour, int minute, TripStatus status, String direction) {
        Trip t = new Trip();
        t.setLineName(line);
        t.setDirection(direction);
        t.setServiceDate(date);
        t.setScheduledDeparture(date.atTime(hour, minute));
        t.setStatus(status);
        return tripRepository.save(t);
    }

    /**
     * Tạo toàn bộ TripStops dựa trên danh sách ga của tuyến
     *
     * @param delayBase mỗi ga sẽ trễ delayBase phút (vd 3 phút)
     */
    private void createTripStops(Trip trip, List<Station> stations,
            int startMinutes, int delayBase) {

        int between = 3; // 3 phút giữa 2 ga

        for (int i = 0; i < stations.size(); i++) {

            int scheduledMin = startMinutes + between * i;

            LocalDateTime sched = trip.getServiceDate()
                    .atStartOfDay()
                    .plusMinutes(scheduledMin);

            TripStop ts = new TripStop();
            ts.setTrip(trip);
            ts.setStation(stations.get(i));
            ts.setStopOrder(i + 1);
            ts.setScheduledArrival(sched);

            int delay = (delayBase == 0) ? 0 : (delayBase); // delay cứng 3 phút
            ts.setDelayMinutes(delay);
            ts.setActualArrival(sched.plusMinutes(delay));

            tripStopRepository.save(ts);
        }
    }
}
