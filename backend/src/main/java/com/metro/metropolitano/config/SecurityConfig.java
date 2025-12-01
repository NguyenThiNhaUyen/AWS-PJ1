package com.metro.metropolitano.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.metro.metropolitano.service.UserDetailsServiceImpl;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(e -> e.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // ======= PUBLIC (NO LOGIN) =======
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/stations/**").permitAll()
                        .requestMatchers("/api/routes/**").permitAll()
                        .requestMatchers("/api/fares/**").permitAll()
                        .requestMatchers("/api/admin/trips/monitor").permitAll()
                        .requestMatchers("/api/admin/delays/**").permitAll()
                        .requestMatchers(
                               "/api/payments/vnpay/create",
                               "/api/payments/vnpay/return",
                               "/api/payments/vnpay/ipn"
                        ).permitAll()
                                .requestMatchers("/api/dev/**").permitAll()




                                // Public Trips endpoints
                        .requestMatchers("/api/trips/public/**").permitAll()
                        .requestMatchers("/api/trips/arrivals/**").permitAll()

                        // VNPay callbacks must be PUBLIC
                        .requestMatchers(
                                "/api/payments/vnpay/create",
                                "/api/payments/vnpay/return",
                                "/api/payments/vnpay/ipn"
                        ).permitAll()

                        // ======= USER (REQUIRES TOKEN) =======
                        .requestMatchers("/api/tickets/my").authenticated()
                        .requestMatchers("/api/tickets/activate/**").authenticated()
                        .requestMatchers("/api/tickets/scan/**").authenticated()
                        .requestMatchers("/api/account/upload-avatar").authenticated()

                        // ======= ADMIN AREA =======
//                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Default: require auth
                        .anyRequest().authenticated()
                );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
