package com.metro.metropolitano.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;

@Component
@RequiredArgsConstructor
public class SecretProvider {
    private final SecretsManagerClient sm;
    private final ObjectMapper om = new ObjectMapper();

    public JsonNode fetch(String secretName) {
        var req = GetSecretValueRequest.builder().secretId(secretName).build();
        var res = sm.getSecretValue(req);
        try { return om.readTree(res.secretString()); }
        catch (Exception e) { throw new RuntimeException("Cannot parse secret: " + secretName, e); }
    }
}
