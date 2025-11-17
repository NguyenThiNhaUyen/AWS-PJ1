package com.metro.metropolitano.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.metro.metropolitano.dto.TimetableDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
@Service
@RequiredArgsConstructor
public class TimetableService {

    private final S3Client s3Client;
    private final ObjectMapper objectMapper;

    @Value("${app.route.bucket}")
    private String bucket;

    @Value("${metro.timetable.prefix:timetable/}")
    private String prefix;

    public TimetableDto getTimetable(String lineName, String type) {
        String timetableType = (type == null || type.isBlank()) ? "weekday" : type.toLowerCase();
        String lineKey = lineName.toLowerCase().replace(" ", "");

        String key = prefix + lineKey + "-" + timetableType + ".json";

        try {
            GetObjectRequest req = GetObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .build();

            ResponseBytes<?> bytes = s3Client.getObjectAsBytes(req);

            return objectMapper.readValue(bytes.asInputStream(), TimetableDto.class);

        } catch (Exception e) {
            throw new RuntimeException("Cannot load timetable: s3://" + bucket + "/" + key, e);
        }
    }
}
