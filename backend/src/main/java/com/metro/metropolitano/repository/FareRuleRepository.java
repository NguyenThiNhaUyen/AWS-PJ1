package com.metro.metropolitano.repository;

import com.metro.metropolitano.model.FareRule;
import com.metro.metropolitano.model.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FareRuleRepository extends JpaRepository<FareRule,Long> {
    Optional<FareRule> findByStartStationAndEndStation(Station start, Station end);
}
