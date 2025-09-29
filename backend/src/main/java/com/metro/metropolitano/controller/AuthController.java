package com.metro.metropolitano.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.URLDecoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import com.metro.metropolitano.dto.LoginRequest;
import com.metro.metropolitano.dto.LoginResponse;
import com.metro.metropolitano.dto.RegisterRequest;
import com.metro.metropolitano.dto.OAuth2CodeRequest;
import com.metro.metropolitano.service.AccountService;
import com.metro.metropolitano.service.OAuth2UserServiceImpl;
import com.metro.metropolitano.utils.JwtUtils;
import com.metro.metropolitano.model.Account;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AccountService accountService;


    @Autowired
    private OAuth2UserServiceImpl oauth2UserService;

    @Autowired
    private JwtUtils jwtUtils;

    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret:}")
    private String googleClientSecret;

    @GetMapping("/oauth2/authorize")
    public ResponseEntity<Map<String, String>> getAuthorizationUrl(@RequestParam String provider, @RequestParam String redirectUri) {
        if (!"google".equalsIgnoreCase(provider)) {
            throw new IllegalArgumentException("Only google provider supported");
        }

        String base = "https://accounts.google.com/o/oauth2/v2/auth";
        String scope = "openid email profile";
        StringBuilder sb = new StringBuilder(base);
        sb.append("?client_id=").append(URLEncoder.encode(googleClientId, StandardCharsets.UTF_8));
        sb.append("&redirect_uri=").append(URLEncoder.encode(redirectUri, StandardCharsets.UTF_8));
        sb.append("&response_type=code");
        sb.append("&scope=").append(URLEncoder.encode(scope, StandardCharsets.UTF_8));
        sb.append("&access_type=offline");
        sb.append("&include_granted_scopes=true");
        sb.append("&prompt=consent");

        return ResponseEntity.ok(Map.of("url", sb.toString()));
    }
    

    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(accountService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse resp = accountService.login(request);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/oauth2/code")
    public ResponseEntity<LoginResponse> exchangeCode(@RequestBody OAuth2CodeRequest req) {
        if (!"google".equalsIgnoreCase(req.getProvider())) {
            throw new IllegalArgumentException("Only google provider supported");
        }

        HttpClient client = HttpClient.newHttpClient();
        URI tokenUri = URI.create("https://oauth2.googleapis.com/token");

        // If client sent an URL-encoded code (contains % or +), decode it first to avoid double-encoding
        String incoming = req.getCode();
        String codeValue = incoming;
        if (codeValue != null && (codeValue.contains("%") || codeValue.contains("+"))) {
            try {
                codeValue = URLDecoder.decode(codeValue, StandardCharsets.UTF_8);
            } catch (IllegalArgumentException ex) {
                // fallback to original if decode fails for any reason
                codeValue = incoming;
            }
        }

        Map<String, String> form = new HashMap<>();
        form.put("code", codeValue);
        form.put("client_id", googleClientId);
        form.put("client_secret", googleClientSecret);
        form.put("redirect_uri", req.getRedirectUri());
        form.put("grant_type", "authorization_code");

        StringBuilder formBodyBuilder = new StringBuilder();
        for (Map.Entry<String, String> e : form.entrySet()) {
            if (formBodyBuilder.length() > 0) {
                formBodyBuilder.append('&');
            }
            formBodyBuilder.append(URLEncoder.encode(e.getKey(), StandardCharsets.UTF_8));
            formBodyBuilder.append('=');
            formBodyBuilder.append(URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8));
        }

        HttpRequest tokenRequest = HttpRequest.newBuilder()
                .uri(tokenUri)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(formBodyBuilder.toString()))
                .build();

        try {
            HttpResponse<String> tokenResp = client.send(tokenRequest, HttpResponse.BodyHandlers.ofString());
            if (tokenResp.statusCode() != 200) {
                throw new RuntimeException("Token exchange failed: " + tokenResp.body());
            }

            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> tokenJson = mapper.readValue(tokenResp.body(), new TypeReference<Map<String, Object>>() {});
            String accessToken = (String) tokenJson.get("access_token");

            URI userInfoUri = URI.create("https://openidconnect.googleapis.com/v1/userinfo");
            HttpRequest userReq = HttpRequest.newBuilder()
                    .uri(userInfoUri)
                    .header("Authorization", "Bearer " + accessToken)
                    .GET()
                    .build();

            HttpResponse<String> userResp = client.send(userReq, HttpResponse.BodyHandlers.ofString());
            if (userResp.statusCode() != 200) {
                throw new RuntimeException("Failed fetching userinfo: " + userResp.body());
            }

            Map<String, Object> userJson = mapper.readValue(userResp.body(), new TypeReference<Map<String, Object>>() {});

            Account account = oauth2UserService.processProviderUser("google", userJson);

            String jwt = jwtUtils.generateTokenFromUsername(account.getEmail() != null ? account.getEmail() : account.getUsername());

            LoginResponse resp = new LoginResponse(jwt, account.getId(), account.getUsername(), account.getFullName(), account.getEmail(), account.getRole());
            return ResponseEntity.ok(resp);

        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("OAuth code exchange failed", e);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody com.metro.metropolitano.dto.ForgotPasswordRequest req) {
        boolean ok = accountService.requestPasswordReset(req);
    return ResponseEntity.ok().body(Map.of("ok", ok));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody com.metro.metropolitano.dto.ResetPasswordRequest req) {
        boolean ok = accountService.resetPassword(req);
    return ResponseEntity.ok().body(Map.of("ok", ok));
    }
}
