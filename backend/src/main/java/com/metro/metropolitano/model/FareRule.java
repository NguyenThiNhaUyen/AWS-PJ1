package com.metro.metropolitano.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fare_rules",uniqueConstraints = @UniqueConstraint(columnNames = {"start_station_id","end_station_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FareRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "start_station_id")
    private Station startStation;

    @ManyToOne
    @JoinColumn(name = "end_station_id")
    private Station endStation;

    private Double price;
    private String name;


    public FareRule(Station benThanh, Station end, Double value, String s) {
        this.startStation=benThanh;
        this.endStation=end;
        this.price=value;
        this.name=s;
    }
}
