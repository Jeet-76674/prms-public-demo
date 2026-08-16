package com.prms.dto.response;

public class FileUploadResponse {

    private boolean success;

    private String message;

    private String fileUrl;

    public FileUploadResponse() {
    }

    public FileUploadResponse(
            boolean success,
            String message,
            String fileUrl) {

        this.success = success;
        this.message = message;
        this.fileUrl = fileUrl;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

}