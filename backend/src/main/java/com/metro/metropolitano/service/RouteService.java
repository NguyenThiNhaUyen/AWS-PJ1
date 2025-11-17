package com.metro.metropolitano.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class RouteService {
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
}
