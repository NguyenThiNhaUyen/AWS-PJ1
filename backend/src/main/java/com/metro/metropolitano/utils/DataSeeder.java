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

        // Lấy tất cả các ga, đã được sắp xếp theo orderIndex
        List<Station> allStations = stationRepository.findAll();
        allStations.sort((s1, s2) -> Integer.compare(s1.getOrderIndex(), s2.getOrderIndex()));

        // Tạo fare rule cho mọi cặp ga (i, j) với i != j
        for (int i = 0; i < allStations.size(); i++) {
            for (int j = 0; j < allStations.size(); j++) {
                if (i == j) continue; // Bỏ qua cùng ga

                Station start = allStations.get(i);
                Station end = allStations.get(j);

                // Tính khoảng cách giữa 2 ga
                int distance = Math.abs(start.getOrderIndex() - end.getOrderIndex());

                // Tính giá dựa trên khoảng cách
                // 1 ga: 6000đ, mỗi ga tiếp theo +1000đ
                double price = 5000.0 + (distance * 1000.0);

                fareRuleRepository.save(new FareRule(start, end, price, "Line 1"));
            }
        }
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
        ticketTypeRepository.save(new TicketType("Ve luot", 0.0, 0, true));
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
                passwordEncoder.encode("adminpass"),
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
