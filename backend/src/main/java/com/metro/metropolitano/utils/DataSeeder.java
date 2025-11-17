package com.metro.metropolitano.utils;

import com.metro.metropolitano.model.*;
import com.metro.metropolitano.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static java.util.Map.entry;

@Component
@RequiredArgsConstructor
@Transactional
public class DataSeeder implements CommandLineRunner {

    private final StationRepository stationRepository;
    private final FareRuleRepository fareRuleRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final AccountRepository accountRepository;

    @Override
    public void run(String... args) {
        seedStations();
        seedFareRules();
        seedTicketTypes();
        seedAccounts();

        System.out.println("=== DataSeeder DONE ===");
    }

    // ============================
    // 1. SEED STATIONS
    // ============================
    private void seedStations() {
        if (stationRepository.count() > 0) return;

        List<String> names = Arrays.asList(
                "Ben Thanh",
                "Nha Hat TP",
                "Ba Son",
                "Van Thanh",
                "Tan Cang",
                "Thao Dien",
                "An Phu",
                "Rach Chiec",
                "Phuoc Long",
                "Binh Thai",
                "Thu Duc",
                "Khu CNC",
                "DH Quoc Gia",
                "BX Suoi Tien"
        );

        int idx = 1;
        for (String n : names) {
            stationRepository.save(new Station(n, "Line 1", idx++));
        }
    }

    // ============================
    // 2. SEED FARE RULES
    // ============================
    private void seedFareRules() {
        if (fareRuleRepository.count() > 0) return;

        Station benThanh = stationRepository.findByName("Ben Thanh")
                .orElseThrow(() -> new RuntimeException("Ben Thanh not found"));

        Map<String, Double> prices = Map.ofEntries(
                entry("Nha Hat TP", 6000.0),
                entry("Ba Son", 6000.0),
                entry("Van Thanh", 6000.0),
                entry("Tan Cang", 6000.0),
                entry("Thao Dien", 6000.0),
                entry("An Phu", 6000.0),
                entry("Rach Chiec", 8000.0),
                entry("Phuoc Long", 9000.0),
                entry("Binh Thai", 11000.0),
                entry("Thu Duc", 13000.0),
                entry("Khu CNC", 15000.0),
                entry("DH Quoc Gia", 17000.0),
                entry("BX Suoi Tien", 19000.0)
        );

        prices.forEach((name, price) -> {
            Station end = stationRepository.findByName(name)
                    .orElseThrow(() -> new RuntimeException("Station not found: " + name));

            fareRuleRepository.save(new FareRule(benThanh, end, price, "Line 1"));
        });
    }

    // ============================
    // 3. SEED TICKET TYPES
    // ============================
    private void seedTicketTypes() {
        if (ticketTypeRepository.count() > 0) return;

        ticketTypeRepository.save(new TicketType("Ve 1 ngay", 40000.0, 24, false));
        ticketTypeRepository.save(new TicketType("Ve 3 ngay", 90000.0, 72, false));
        ticketTypeRepository.save(new TicketType("Ve thang", 300000.0, 720, false));
        ticketTypeRepository.save(new TicketType("Ve thang HSSV", 150000.0, 720, false));
        ticketTypeRepository.save(new TicketType("Ve tuyen", 0.0, 0, true));
    }

    // ============================
    // 4. SEED ACCOUNTS
    // ============================
    private void seedAccounts() {
        if (accountRepository.count() > 0) return;

        // Constructor đã set isActive = true → không cần set thêm
        Account admin = new Account(
                "Admin",
                "admin",
                "adminpass",
                "admin@metro.local",
                Role.ADMIN,
                Provider.LOCAL
        );
        accountRepository.save(admin);

        Account demo = new Account(
                "Nguyen Van A",
                "ngu1",
                "password",
                "a@gmail.com",
                Role.CUSTOMER,
                Provider.LOCAL
        );
        accountRepository.save(demo);
    }
}
