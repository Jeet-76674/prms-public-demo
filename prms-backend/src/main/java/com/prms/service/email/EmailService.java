package com.prms.service.email;

public interface EmailService {

    void sendOtp(String email, String otp);

    void sendHtmlEmail(String to, String subject, String htmlBody);

    void sendRecruiterStatusEmail(String email, String status);

    void sendStudentSelectedEmail(String email, String company, String jobRole, String packageAmount, String joiningDate);

    void sendOfferAcceptedEmail(String studentEmail, String recruiterEmail, String company, String studentName);

    void sendOfferDeclinedEmail(String recruiterEmail, String company, String studentName);

    void sendOfferJoinedEmail(String studentEmail, String recruiterEmail, String tpoEmail, String company, String studentName);

    void sendInterviewScheduledEmail(String studentEmail, String studentName, String company, String jobTitle, String date, String time, String linkOrLocation, String instructions);
}