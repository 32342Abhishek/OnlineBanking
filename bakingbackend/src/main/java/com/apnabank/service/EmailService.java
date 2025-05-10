package com.apnabank.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Async
    public void sendOtpEmail(String to, String otp) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setTo(to);
            helper.setSubject("Your OTP for Apna Bank");
            helper.setFrom("no-reply@apnabank.com");

            Context context = new Context();
            context.setVariable("otp", otp);
            context.setVariable("expiryMinutes", 5);

            String htmlContent = templateEngine.process("otp-template", context);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            log.info("OTP email sent to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send OTP email", e);
            throw new RuntimeException("Could not send OTP email", e);
        }
    }

    @Async
    public void sendWelcomeEmail(String to, String name) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setTo(to);
            helper.setSubject("Welcome to Apna Bank");
            helper.setFrom("no-reply@apnabank.com");

            Context context = new Context();
            context.setVariable("name", name);

            String htmlContent = templateEngine.process("welcome-template", context);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            log.info("Welcome email sent to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send welcome email", e);
            throw new RuntimeException("Could not send welcome email", e);
        }
    }

    @Async
    public void sendTransactionNotification(String to, String accountNumber, String transactionType, String amount) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setTo(to);
            helper.setSubject("Transaction Notification - Apna Bank");
            helper.setFrom("no-reply@apnabank.com");

            Context context = new Context();
            context.setVariable("accountNumber", accountNumber);
            context.setVariable("transactionType", transactionType);
            context.setVariable("amount", amount);

            String htmlContent = templateEngine.process("transaction-template", context);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            log.info("Transaction notification email sent to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send transaction notification email", e);
            throw new RuntimeException("Could not send transaction notification email", e);
        }
    }
} 