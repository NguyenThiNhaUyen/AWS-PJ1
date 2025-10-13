package com.metro.metropolitano.utils;

import com.metro.metropolitano.model.*;
import com.metro.metropolitano.repository.AccountRepository;
import com.metro.metropolitano.repository.FareRuleRepository;
import com.metro.metropolitano.repository.StationRepository;
import com.metro.metropolitano.repository.TicketTypeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static java.util.Map.entry;

@Component
@Transactional
public class DataSeeder implements CommandLineRunner {
    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private FareRuleRepository fareRuleRepository;

    @Autowired
    private TicketTypeRepository ticketTypeRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public void run(String... args) throws Exception{
        if(stationRepository.count()==0){
            List<String> names= Arrays.asList("Ben Thanh","Nha Hat TP","Ba Son","Van Thanh","Tan Cang","Thao Dien","An Phu","Rach Chiec","Phuoc Long","Binh Thai","Thu Duc","Khu CNC","DH Quoc Gia","BX Suoi Tien");
            int idx=1;
            for(String n:names){
                Station s=new Station(n,"Line 1",idx++);
                stationRepository.save(s);
            }

            Station benThanh=stationRepository.findByName("Ben Thanh").get();
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
            for(Map.Entry<String, Double> e : prices.entrySet()) {
                Station end = stationRepository.findByName(e.getKey()).get();
                FareRule fr = new FareRule(benThanh, end, e.getValue(), "Line 1");
                fareRuleRepository.save(fr);
            }
        }
        if(ticketTypeRepository.count()==0){
            ticketTypeRepository.save(new TicketType("Ve 1 ngay",40000.0,24*1,false));
            ticketTypeRepository.save(new TicketType("Ve 3 ngay",90000.0,24*3,false));
            ticketTypeRepository.save(new TicketType("Ve thang",300000.0,24*30,false));
            ticketTypeRepository.save(new TicketType("Ve thang HSSV",150000.0,24*30,false));
            ticketTypeRepository.save(new TicketType("Ve tuyen", 0.0, 0, true));
        }
        if(accountRepository.count()==0){
            Account admin=new Account("Admin","admin","adminpass","admin@metro.local", Role.ADMIN,Provider.LOCAL);
            admin.setIsActive(true);
            accountRepository.save(admin);
            Account demo=new Account("Nguyen Van A","ngu1","password","a@gmail.com", Role.CUSTOMER,Provider.LOCAL);
            demo.setIsActive(true);
            accountRepository.save(demo);
        }
    }
}
