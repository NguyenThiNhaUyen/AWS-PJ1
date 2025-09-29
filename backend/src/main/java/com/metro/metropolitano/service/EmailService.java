package com.metro.metropolitano.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.from}")
    private String fromEmail;
    
    @Value("${app.backend.url:http://localhost:8080}")
    private String backendUrl;
    
    @Async
    public void sendVerificationEmail(String to, String token) {
        logger.info("Sending verification email to: {}", to);
        
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Xác thực tài khoản Metro Politano");
            
            String verificationUrl = backendUrl + "/api/auth/verify-email?token=" + token;
            
            String htmlContent = """
                <html>
                <body>
                    <h2>Chào mừng bạn đến với Metro Politano!</h2>
                    <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng bấm vào nút bên dưới để xác thực email và kích hoạt đầy đủ quyền sử dụng:</p>
                    <p><a href="%s" style="background-color: #0066cc; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">Xác thực Email</a></p>
                    <p>Hoặc copy và dán link sau vào trình duyệt:</p>
                    <p>%s</p>
                    <p>Link này sẽ hết hạn sau 24 giờ.</p>
                    <br>
                    <p>Trân trọng,<br>
                    Đội ngũ Metro Politano</p>
                </body>
                </html>
                """.formatted(verificationUrl, verificationUrl);
            
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Verification email sent successfully to: {}", to);
            
        } catch (MessagingException e) {
            logger.error("Failed to send verification email to: {}", to, e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }
    
    @Async
    public void sendWelcomeEmail(String to, String fullName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Chào mừng bạn đến với Metro Politano!");
            
            String htmlContent = """
                <html>
                <body>
                    <h2>Chào %s!</h2>
                    <p>Tài khoản của bạn đã được xác thực thành công!</p>
                    <p>Bây giờ bạn có thể sử dụng Metro Politano để:</p>
                    <ul>
                        <li>Xem lịch trình và tình trạng chạy tàu theo thời gian thực</li>
                        <li>Tra cứu tuyến, điểm dừng và thời gian di chuyển</li>
                        <li>Nhận thông báo trễ, sự cố hoặc thay đổi lịch trình</li>
                        <li>Mua và quản lý vé điện tử (nếu có)</li>
                    </ul>
                    <p>Chúc bạn có những hành trình thuận tiện và an toàn!</p>
                    <br>
                    <p>Trân trọng,<br>
                    Đội ngũ Metro Politano</p>
                </body>
                </html>
                """.formatted(fullName);
            
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Welcome email sent successfully to: {}", to);
            
        } catch (MessagingException e) {
            logger.error("Failed to send welcome email to: {}", to, e);
        }
    }
    
    public void sendPasswordResetEmail(String to, String fullName, String resetCode) {
        logger.info("Sending password reset email to: {}", to);
        
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Đặt lại mật khẩu - Metro Politano");
            
            String htmlContent = """
                <html>
                <head>
                    <style>
                        .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
                        .header { background: linear-gradient(135deg, #4a69bd, #6c7ce7); padding: 30px; text-align: center; color: white; }
                        .content { padding: 30px; background-color: #f8f9fa; }
                        .code-box { background-color: #fff; border: 2px solid #4a69bd; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
                        .reset-code { font-size: 36px; font-weight: bold; color: #4a69bd; letter-spacing: 8px; }
                        .footer { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🚆 Metro Politano</h1>
                            <h2>Đặt lại mật khẩu</h2>
                        </div>
                        <div class="content">
                            <p>Chào <strong>%s</strong>,</p>
                            <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản GameTracker của mình.</p>
                            <p>Vui lòng sử dụng mã xác nhận 6 chữ số bên dưới:</p>
                            
                            <div class="code-box">
                                <div class="reset-code">%s</div>
                                <p style="margin: 10px 0 0 0; color: #666;">Mã xác nhận</p>
                            </div>
                            
                            <p><strong>Lưu ý quan trọng:</strong></p>
                            <ul>
                                <li>Mã này sẽ hết hạn sau <strong>15 phút</strong></li>
                                <li>Chỉ sử dụng được một lần duy nhất</li>
                                <li>Không chia sẻ mã này với bất kỳ ai</li>
                            </ul>
                            
                            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này và tài khoản của bạn vẫn sẽ an toàn.</p>
                        </div>
                            <div class="footer">
                            <p>© 2025 Metro Politano - Ứng dụng quản lý và theo dõi tuyến metro</p>
                            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(fullName, resetCode);
            
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Password reset email sent successfully to: {}", to);
            
        } catch (MessagingException e) {
            logger.error("Failed to send password reset email to: {}", to, e);
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    @Async
    public void sendCredentialsEmail(String to, String fullName, String username, String rawPassword) {
        logger.info("Sending credentials email to: {}", to);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Thông tin đăng nhập Metro Politano");

            String htmlContent = """
                <html>
                <body>
                    <h2>Chào %s!</h2>
                    <p>Tài khoản của bạn đã được tạo qua Google OAuth. Dưới đây là thông tin đăng nhập tạm thời:</p>
                    <ul>
                        <li><strong>Username:</strong> %s</li>
                        <li><strong>Password (tạm thời):</strong> %s</li>
                    </ul>
                    <p>Vì lý do bảo mật, bạn nên đổi mật khẩu ngay sau khi đăng nhập bằng tính năng "Đổi mật khẩu" hoặc sử dụng chức năng "Quên mật khẩu" để đặt mật khẩu mới.</p>
                    <p>Nếu bạn không yêu cầu tạo tài khoản này, vui lòng liên hệ bộ phận hỗ trợ.</p>
                    <br>
                    <p>Trân trọng,<br>
                    Đội ngũ Metro Politano</p>
                </body>
                </html>
                """.formatted(fullName, username, rawPassword);

            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Credentials email sent successfully to: {}", to);

        } catch (MessagingException e) {
            logger.error("Failed to send credentials email to: {}", to, e);
            // don't throw to avoid breaking authentication flow; just log
        }
    }
}
