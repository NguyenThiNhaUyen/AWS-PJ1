package com.metro.metropolitano.repository;

import com.metro.metropolitano.model.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StationRepository extends JpaRepository<Station, Long> {

    Optional<Station> findByName(String name);

    // Lấy station theo lineName, sắp xếp đúng thứ tự tuyến
    List<Station> findByLineNameOrderByOrderIndexAsc(String lineName);

    // Lấy danh sách tên tuyến (lineName) không trùng
    @Query("SELECT DISTINCT s.lineName FROM Station s")
    List<String> findDistinctLineNames();

    @Query("SELECT DISTINCT s.lineName FROM Station s")
    List<String> findAllLineNames();

    int countByLineName(String lineName);
}
