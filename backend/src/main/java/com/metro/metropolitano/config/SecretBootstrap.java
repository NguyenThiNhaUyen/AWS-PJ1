package com.metro.metropolitano.config;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecretBootstrap implements ApplicationRunner {
    private final SecretProvider secrets;

    @Value("${app.secrets.db}")     String dbSecret;
    @Value("${app.secrets.jwt}")    String jwtSecret;
    @Value("${app.secrets.mail}")   String mailSecret;
    @Value("${app.secrets.google}") String googleSecret;
    @Value("${app.secrets.vnpay}")  String vnpaySecret;

    @Override
    public void run(ApplicationArguments args) {
        // DB
        JsonNode db = secrets.fetch(dbSecret);
        setIfAbsent("DB_URL",      db.path("url").asText(null));
        setIfAbsent("DB_USERNAME", db.path("username").asText(null));
        setIfAbsent("DB_PASSWORD", db.path("password").asText(null));

        // JWT
        JsonNode jwt = secrets.fetch(jwtSecret);
        setIfAbsent("JWT_SECRET", jwt.path("jwtSecret").asText(null));
        setIfAbsent("JWT_EXP",    jwt.path("jwtExpMs").asText("86400000"));

        // Mail
        JsonNode mail = secrets.fetch(mailSecret);
        setIfAbsent("MAIL_USERNAME", mail.path("username").asText(null));
        setIfAbsent("MAIL_PASSWORD", mail.path("password").asText(null));
        setIfAbsent("MAIL_FROM",     mail.path("from").asText(null));

        // Google
        JsonNode gg = secrets.fetch(googleSecret);
        setIfAbsent("GOOGLE_CLIENT_ID",     gg.path("clientId").asText(null));
        setIfAbsent("GOOGLE_CLIENT_SECRET", gg.path("clientSecret").asText(null));

        // VNPay
        JsonNode vnp = secrets.fetch(vnpaySecret);
        setIfAbsent("VNP_TMN_CODE",    vnp.path("tmnCode").asText(null));
        setIfAbsent("VNP_HASH_SECRET", vnp.path("hashSecret").asText(null));
        setIfAbsent("VNP_PAY_URL",     vnp.path("payUrl").asText("https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"));
        setIfAbsent("VNP_RETURN_URL",  vnp.path("returnUrl").asText(null));
    }

    private void setIfAbsent(String key, String val) {
        if (val != null && System.getProperty(key) == null && System.getenv(key) == null) {
            System.setProperty(key, val);
        }
    }
}
