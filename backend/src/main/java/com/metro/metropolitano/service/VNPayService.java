package com.metro.metropolitano.service;

import com.metro.metropolitano.model.Payment;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
@Service
@RequiredArgsConstructor
public class VNPayService {

    private static final String TMN_CODE    = "9DDMJOBG";
    private static final String HASH_SECRET = "7MUW6K20MIXQKEFYPKX892UJ3ELSD40Z";

    @Value("${vnp.pay_url}")     String payUrl;
    @Value("${vnp.return_url}")  String returnUrl;

    public Map<String, String> extractParams(HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();
        var names = request.getParameterNames();
        while (names.hasMoreElements()) {
            String name = names.nextElement();
            String value = request.getParameter(name);
            if (value != null) {
                params.put(name, value);
            }
        }
        return params;
    }


    /** NEW: nhận Payment thay vì orderId + amount */
    public String createPaymentUrl(Payment payment, String ip) {

        String orderId = String.valueOf(payment.getId());
        long amountVND = Math.round(payment.getAmount()); // amount đã có từ DB

        Map<String,String> v = new TreeMap<>();
        v.put("vnp_Version",   "2.1.0");
        v.put("vnp_Command",   "pay");
        v.put("vnp_TmnCode",   TMN_CODE);
        v.put("vnp_Amount",    String.valueOf(amountVND * 100));
        v.put("vnp_CreateDate", LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));
        v.put("vnp_CurrCode",  "VND");
        v.put("vnp_IpAddr",    ip);
        v.put("vnp_Locale",    "vn");
        v.put("vnp_OrderInfo", "Ticket:" + orderId);
        v.put("vnp_OrderType", "other");
        v.put("vnp_ReturnUrl", returnUrl);
        v.put("vnp_TxnRef",    orderId);

        String query = buildQuery(v);
        String secureHash = hmacSHA512(HASH_SECRET, query);

        // Log debug
        System.out.println("=== VNPay DEBUG ===");
        System.out.println("orderId     = " + orderId);
        System.out.println("amount      = " + amountVND);
        System.out.println("query       = " + query);
        System.out.println("secureHash  = " + secureHash);

        return payUrl + "?" + query
                + "&vnp_SecureHashType=HmacSHA512"
                + "&vnp_SecureHash=" + secureHash;
    }

    public boolean verifySignature(Map<String,String> params) {
        String secureHash = params.getOrDefault("vnp_SecureHash", "");
        Map<String,String> sorted = new TreeMap<>();
        for (var e : params.entrySet()) {
            String k = e.getKey();
            if ("vnp_SecureHash".equalsIgnoreCase(k)
                    || "vnp_SecureHashType".equalsIgnoreCase(k)) continue;
            sorted.put(k, e.getValue());
        }
        String data = buildQuery(sorted);
        String calc = hmacSHA512(HASH_SECRET, data);
        return secureHash.equalsIgnoreCase(calc);
    }

    public static String buildQuery(Map<String,String> params) {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String,String> e : params.entrySet()) {
            String key   = e.getKey();
            String value = e.getValue();
            if (value == null || value.isBlank()) continue;
            if (sb.length() > 0) sb.append('&');
            sb.append(encode(key)).append('=').append(encode(value));
        }
        return sb.toString();
    }

    private static String encode(String s) {
        return URLEncoder.encode(s, StandardCharsets.UTF_8);
    }

    public static String hmacSHA512(String key, String data) {
        try {
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA512");
            mac.init(new javax.crypto.spec.SecretKeySpec(
                    key.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA512"
            ));
            byte[] h = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : h) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
