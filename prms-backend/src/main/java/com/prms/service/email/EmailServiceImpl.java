package com.prms.service.email;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);
    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    @Value("${brevo.api.key:}")
    private String apiKey;

    @Value("${brevo.sender.email:placement.prms@gmail.com}")
    private String senderEmail;

    @Value("${brevo.sender.name:Placement Recruitment Management System}")
    private String senderName;

    private final HttpClient httpClient;

    public EmailServiceImpl() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    @Override
    @Async
    public void sendOtp(String email, String otp) {
        String subject = "PRMS Email Verification OTP";
        String htmlBody = "<p>Dear User,</p>"
                + "<p>Your One Time Password (OTP) for PRMS verification is:</p>"
                + "<h2 style=\"color: #2563eb; letter-spacing: 2px;\">" + otp + "</h2>"
                + "<p>This OTP is valid for 5 minutes.<br/>"
                + "Please do not share this OTP with anyone.</p>"
                + "<br/><p>Regards,</p><p>Placement Recruitment Management System</p>";

        sendHtmlEmail(email, subject, htmlBody);
    }

    @Override
    @Async
    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            log.warn("[BREVO] Brevo API key is not configured. Email to {} ('{}') was skipped.", to, subject);
            return;
        }

        try {
            String requestJson = buildEmailJson(to, subject, htmlBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(BREVO_API_URL))
                    .timeout(Duration.ofSeconds(15))
                    .header("api-key", apiKey.trim())
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("[BREVO] Email successfully sent to {}. Status code: {}", to, response.statusCode());
            } else {
                log.error("[BREVO] Failed to send email to {}. HTTP Status: {}, Response: {}",
                        to, response.statusCode(), response.body());
            }
        } catch (Exception e) {
            log.error("[BREVO] Exception occurred while sending email to {}: {}", to, e.getMessage(), e);
        }
    }

    private String buildEmailJson(String to, String subject, String htmlContent) {
        return "{"
                + "\"sender\":{\"name\":\"" + escapeJson(senderName) + "\",\"email\":\"" + escapeJson(senderEmail) + "\"},"
                + "\"to\":[{\"email\":\"" + escapeJson(to) + "\"}],"
                + "\"subject\":\"" + escapeJson(subject) + "\","
                + "\"htmlContent\":\"" + escapeJson(htmlContent) + "\""
                + "}";
    }

    private String escapeJson(String s) {
        if (s == null) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            switch (ch) {
                case '"' -> sb.append("\\\"");
                case '\\' -> sb.append("\\\\");
                case '\b' -> sb.append("\\b");
                case '\f' -> sb.append("\\f");
                case '\n' -> sb.append("\\n");
                case '\r' -> sb.append("\\r");
                case '\t' -> sb.append("\\t");
                default -> {
                    if (ch <= 0x1F) {
                        sb.append(String.format("\\u%04x", (int) ch));
                    } else {
                        sb.append(ch);
                    }
                }
            }
        }
        return sb.toString();
    }

    @Override
    @Async
    public void sendRecruiterStatusEmail(String email, String status) {
        String subject = "Recruiter Account " + status;
        String htmlBody = "<h3>Dear Recruiter,</h3>"
                + "<p>Your account status has been updated to: <strong>" + status + "</strong>.</p>"
                + "<br/><p>Regards,</p><p>Placement Recruitment Management System</p>";
        sendHtmlEmail(email, subject, htmlBody);
    }

    @Override
    @Async
    public void sendStudentSelectedEmail(String email, String company, String jobRole, String packageAmount, String joiningDate) {
        String subject = "Congratulations! You have been selected.";
        String htmlBody = "<h3>Congratulations!</h3>"
                + "<p>You have been selected for a placement.</p>"
                + "<ul>"
                + "<li><strong>Company:</strong> " + company + "</li>"
                + "<li><strong>Job Role:</strong> " + jobRole + "</li>"
                + "<li><strong>Package:</strong> " + packageAmount + "</li>"
                + "<li><strong>Joining Date:</strong> " + joiningDate + "</li>"
                + "</ul>"
                + "<br/><p>Regards,</p><p>Placement Recruitment Management System</p>";
        sendHtmlEmail(email, subject, htmlBody);
    }

    @Override
    @Async
    public void sendOfferAcceptedEmail(String studentEmail, String recruiterEmail, String company, String studentName) {
        String subject = "Offer Accepted by " + studentName;
        String htmlBody = "<h3>Offer Update</h3>"
                + "<p>The offer extended to <strong>" + studentName + "</strong> by <strong>" + company + "</strong> has been ACCEPTED.</p>"
                + "<br/><p>Regards,</p><p>Placement Recruitment Management System</p>";

        sendHtmlEmail(studentEmail, subject, htmlBody);
        sendHtmlEmail(recruiterEmail, subject, htmlBody);
    }

    @Override
    @Async
    public void sendOfferDeclinedEmail(String recruiterEmail, String company, String studentName) {
        String subject = "Offer Declined by " + studentName;
        String htmlBody = "<h3>Offer Update</h3>"
                + "<p>The offer extended to <strong>" + studentName + "</strong> by <strong>" + company + "</strong> has been DECLINED.</p>"
                + "<br/><p>Regards,</p><p>Placement Recruitment Management System</p>";

        sendHtmlEmail(recruiterEmail, subject, htmlBody);
    }

    @Override
    @Async
    public void sendOfferJoinedEmail(String studentEmail, String recruiterEmail, String tpoEmail, String company, String studentName) {
        String subject = "Joining Confirmed: " + studentName;
        String htmlBody = "<h3>Joining Confirmation</h3>"
                + "<p><strong>" + studentName + "</strong> has officially JOINED <strong>" + company + "</strong>.</p>"
                + "<br/><p>Regards,</p><p>Placement Recruitment Management System</p>";

        sendHtmlEmail(studentEmail, subject, htmlBody);
        sendHtmlEmail(recruiterEmail, subject, htmlBody);
        if (tpoEmail != null && !tpoEmail.isEmpty()) {
            sendHtmlEmail(tpoEmail, subject, htmlBody);
        }
    }

    @Override
    @Async
    public void sendInterviewScheduledEmail(String studentEmail, String studentName, String company, String jobTitle, String date, String time, String linkOrLocation, String instructions) {
        String subject = "Interview Scheduled: " + company + " - " + jobTitle;
        String htmlBody = "<h3>Dear " + studentName + ",</h3>"
                + "<p>An interview has been scheduled for your application at <strong>" + company + "</strong> for the role of <strong>" + jobTitle + "</strong>.</p>"
                + "<h4>Interview Details:</h4>"
                + "<ul>"
                + "<li><strong>Date:</strong> " + date + "</li>"
                + "<li><strong>Time:</strong> " + time + "</li>"
                + "<li><strong>Meeting Link / Location:</strong> " + linkOrLocation + "</li>"
                + "</ul>";

        if (instructions != null && !instructions.trim().isEmpty()) {
            htmlBody += "<h4>Instructions from Recruiter:</h4>"
                     + "<p>" + instructions.replace("\n", "<br/>") + "</p>";
        }

        htmlBody += "<br/><p>Best of luck!</p><p>Placement Recruitment Management System</p>";

        sendHtmlEmail(studentEmail, subject, htmlBody);
    }
}