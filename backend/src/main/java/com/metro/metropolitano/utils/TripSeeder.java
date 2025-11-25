package com.metro.metropolitano.utils;

import com.metro.metropolitano.enums.TripStatus;
import com.metro.metropolitano.model.*;
import com.metro.metropolitano.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

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

        // Seed cho 8 tuyến metro
        seedLineTrips();

        System.out.println("=== TripSeeder DONE ===");
    }

    private void seedLineTrips() {

        LocalDate date = LocalDate.now();

        Map<String, List<String>> metroLines = new LinkedHashMap<>();
        metroLines.put("Line 1", Arrays.asList(
                "Ben Thanh", "Nha Hat TP", "Ba Son", "Van Thanh", "Tan Cang",
                "Thao Dien", "An Phu", "Rach Chiec", "Phuoc Long", "Binh Thai",
                "Thu Duc", "Khu CNC", "DH Quoc Gia", "BX Suoi Tien"
        ));
        metroLines.put("Line 2", Arrays.asList("Ben Thanh", "Tan Dinh", "Hoa Hung", "Tham Luong"));
        metroLines.put("Line 3A", Arrays.asList("Ben Thanh", "Vo Van Kiet", "Binh Tay", "Tan Kien"));
        metroLines.put("Line 3B", Arrays.asList("Cong Hoa", "Hoang Van Thu", "Quang Trung", "Go Vap"));
        metroLines.put("Line 4", Arrays.asList("Thanh Xuan", "Phan Dinh Phung", "Quang Trung", "Hiep Binh Phuoc"));
        metroLines.put("Line 5", Arrays.asList("Canh Dong", "Tan Phu", "Thuan Kieu", "Cho Lon"));
        metroLines.put("Line 6", Arrays.asList("Ba Queo", "Tan Binh", "Tan Son Nhat"));
        metroLines.put("Line 7", Arrays.asList("Thu Duc", "Pham Van Dong", "Binh Trieu", "Go Vap"));
        metroLines.put("Line 8", Arrays.asList("Ho Hoc Lam", "Binh Phu", "Ba Hom", "An Suong"));

        metroLines.forEach((lineName, stationNames) -> {
            System.out.println("Seeding trips for: " + lineName);

            // Load Station từ DB theo tên
            List<Station> stations = new ArrayList<>();
            for (String s : stationNames) {
                stationRepository.findByName(s).ifPresent(stations::add);
            }

            if (stations.isEmpty()) return;

            // Trip A: 05:30
            Trip tripA = createTrip(lineName, date, 5, 30, TripStatus.SCHEDULED);
            createTripStops(tripA, stations, 5 * 60 + 30, 0);

            // Trip B: 05:45
            Trip tripB = createTrip(lineName, date, 5, 45, TripStatus.SCHEDULED);
            createTripStops(tripB, stations, 5 * 60 + 45, 3);
        });
    }

    private Trip createTrip(String line, LocalDate date, int hour, int minute, TripStatus status) {
        Trip t = new Trip();
        t.setLineName(line);
        t.setDirection("A_TO_B");
        t.setServiceDate(date);
        t.setScheduledDeparture(date.atTime(hour, minute));
        t.setStatus(status);
        return tripRepository.save(t);
    }

    /**
     * Tạo toàn bộ TripStops dựa trên danh sách ga của tuyến
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
