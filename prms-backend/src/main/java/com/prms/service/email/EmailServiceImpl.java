package com.prms.service.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    @Async
    public void sendOtp(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("PRMS Email Verification OTP");
        message.setText(
                "Dear User,\n\n"
              + "Your One Time Password (OTP) for PRMS verification is:\n\n"
              + otp
              + "\n\n"
              + "This OTP is valid for 5 minutes.\n"
              + "Please do not share this OTP with anyone.\n\n"
              + "Regards,\n"
              + "Placement Recruitment Management System"
        );
        mailSender.send(message);
    }

    @Override
    @Async
    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
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