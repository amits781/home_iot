package com.aidyn.iot.service;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;

    // Defaults to enabled so production behaviour is unchanged unless this
    // is explicitly set; set EMAIL_ENABLED=false (e.g. in local dev's .env)
    // to skip actually sending mail without touching call sites.
    @Value("${EMAIL_ENABLED:true}")
    private boolean emailEnabled;

    public void sendEmail(String to, String subject, String body) throws MessagingException {
        if (!emailEnabled) {
            log.info("EMAIL_ENABLED=false, skipping email to {} (subject: {})", to, subject);
            return;
        }

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true);

        javaMailSender.send(message);
    }
}
