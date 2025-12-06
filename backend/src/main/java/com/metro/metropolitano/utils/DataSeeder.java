package com.metro.metropolitano.utils;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.metro.metropolitano.model.Account;
import com.metro.metropolitano.model.FareRule;
import com.metro.metropolitano.model.Provider;
import com.metro.metropolitano.model.Role;
import com.metro.metropolitano.model.Station;
import com.metro.metropolitano.model.TicketType;
import com.metro.metropolitano.repository.AccountRepository;
import com.metro.metropolitano.repository.FareRuleRepository;
import com.metro.metropolitano.repository.StationRepository;
import com.metro.metropolitano.repository.TicketTypeRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@Transactional
public class DataSeeder implements CommandLineRunner {

    private final StationRepository stationRepository;
    private final FareRuleRepository fareRuleRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

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

        List<Station> stations = stationRepository.findAll();
        stations.sort((a, b) -> Integer.compare(a.getOrderIndex(), b.getOrderIndex()));

        for (int i = 0; i < stations.size(); i++) {
            for (int j = 0; j < stations.size(); j++) {

                if (i == j) continue;

                Station start = stations.get(i);
                Station end = stations.get(j);

                int distance = Math.abs(start.getOrderIndex() - end.getOrderIndex());

                // Giá vé thực tế (tham khảo metro HCMC)
                double price;
                if (distance <= 3) price = 8000;
                else if (distance <= 7) price = 10000;
                else price = 15000;

                fareRuleRepository.save(new FareRule(
                        start,
                        end,
                        price,
                        "Line 1"
                ));
            }
        }
    }

    // ============================
    // 3. SEED TICKET TYPES
    // ============================
    private void seedTicketTypes() {
        if (ticketTypeRepository.count() > 0) return;

        ticketTypeRepository.save(new TicketType("Vé 1 ngày", 40000.0, 24, false));
        ticketTypeRepository.save(new TicketType("Vé 3 ngày", 90000.0, 72, false));
        ticketTypeRepository.save(new TicketType("Vé tháng", 300000.0, 720, false));
        ticketTypeRepository.save(new TicketType("Vé tháng HSSV", 150000.0, 720, false));
        ticketTypeRepository.save(new TicketType("Vé lượt (tính theo lộ trình)", 0.0, 0, true));
    }

    // ============================
    // 4. SEED ACCOUNTS
    // ============================
    private void seedAccounts() {
        if (accountRepository.count() > 0) return;

        // PASSWORD THẬT → 123456
        String rawPassword = "123456";

        Account admin = new Account(
                "Administrator",
                "admin",
                passwordEncoder.encode(rawPassword),   // Mã hóa đúng cách
                "admin@metro.local",
                Role.ADMIN,
                Provider.LOCAL
        );
        accountRepository.save(admin);

        Account demo = new Account(
                "Nguyen Van A",
                "ngu1",
                passwordEncoder.encode(rawPassword),
                "a@gmail.com",
                Role.CUSTOMER,
                Provider.LOCAL
        );
        accountRepository.save(demo);
    }
}
