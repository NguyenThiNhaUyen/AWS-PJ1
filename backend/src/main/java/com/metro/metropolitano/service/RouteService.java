package com.metro.metropolitano.service;

import com.metro.metropolitano.dto.RouteStatsDTO;
import com.metro.metropolitano.model.Ticket;
import com.metro.metropolitano.repository.StationRepository;
import com.metro.metropolitano.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final StationRepository stationRepo;
    private final TicketRepository ticketRepo;

    private final S3Client s3;
    @Value("${app.route.bucket}") String bucket;

    @Cacheable("routes-all")
    public String getRoutes() { return read("routes/routes.json"); }

    @Cacheable(cacheNames = "route-by-id", key = "#id")
    public String getRouteById(String id) { return read("routes/" + id + ".json"); }

    @Cacheable(cacheNames = "timetable", key = "#id + '-' + #type")
    public String getTimetable(String id, String type) { return read("timetables/" + id + "/" + type + ".json"); }

    private String read(String key) {
        var obj = s3.getObject(b -> b.bucket(bucket).key(key));
        try (obj) { return new String(obj.readAllBytes(), StandardCharsets.UTF_8); }
        catch (IOException e) { throw new UncheckedIOException(e); }
    }

    public List<RouteStatsDTO> getAllRoutesWithStats() {
        List<String> lines = stationRepo.findAllLineNames();

        return lines.stream().map(line -> {
            int stationCount = stationRepo.countByLineName(line);
            List<Ticket> tickets = ticketRepo.findByStartStation_LineName(line);
            int ticketsSold = tickets.size();
            long revenue = tickets.stream().mapToLong(t -> t.getPrice().longValue()).sum();
            return RouteStatsDTO.builder()
                    .lineName(line)
                    .stationCount(stationCount)
                    .ticketsSold(ticketsSold)
                    .revenue(revenue)
                    .status("ACTIVE")
                    .build();
        }).toList();
    }
}
