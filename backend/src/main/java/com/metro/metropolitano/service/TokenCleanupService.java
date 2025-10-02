package com.metro.metropolitano.service;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metro.metropolitano.repository.EmailVerificationTokenRepository;
import com.metro.metropolitano.repository.PasswordResetTokenRepository;

@Service
public class TokenCleanupService {

    private static final Logger logger = LoggerFactory.getLogger(TokenCleanupService.class);

    @Autowired
    private EmailVerificationTokenRepository emailTokenRepo;

    @Autowired
    private PasswordResetTokenRepository passwordTokenRepo;

    // Cron configurable via application.properties; default: daily at 03:00
    @Value("${app.token.cleanup.cron:0 0 3 * * *}")
    private String cleanupCron;

    // Run at configured cron schedule
    @Scheduled(cron = "${app.token.cleanup.cron:0 0 3 * * *}")
    @Transactional
    public void cleanupExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        logger.info("Running token cleanup job at {}", now);

        try {
            // Delete expired email verification tokens
            emailTokenRepo.deleteAllExpiredTokens(now);
            long deletedByCreated = emailTokenRepo.deleteByCreatedAtBefore(now.minusDays(30));
            if (deletedByCreated > 0) {
                logger.info("Deleted {} old email verification tokens older than 30 days", deletedByCreated);
            }

            // Delete expired password reset tokens
            passwordTokenRepo.deleteExpiredTokens(now);

            logger.info("Token cleanup finished");
        } catch (Exception ex) {
            logger.error("Token cleanup failed", ex);
        }
    }
}
