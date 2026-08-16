package com.prms.validation;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileValidator {

    private static final long MAX_RESUME_SIZE = 2 * 1024 * 1024; // 2MB
    private static final long MAX_JD_SIZE = 5 * 1024 * 1024;     // 5MB
    private static final long MAX_IMAGE_SIZE = 2 * 1024 * 1024;  // 2MB

    private static final byte[] PDF_MAGIC = new byte[]{0x25, 0x50, 0x44, 0x46, 0x2D}; // %PDF-
    private static final byte[] JPEG_MAGIC = new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF};
    private static final byte[] PNG_MAGIC = new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A};

    public void validateResume(MultipartFile file) {
        validateCommon(file, MAX_RESUME_SIZE, "Resume");
        validateExtension(file, List.of(".pdf"));
        validatePdfMagicBytes(file);
    }

    public void validateJobDescription(MultipartFile file) {
        validateCommon(file, MAX_JD_SIZE, "Job Description");
        validateExtension(file, List.of(".pdf"));
        validatePdfMagicBytes(file);
    }

    public void validateImage(MultipartFile file, String fieldName) {
        validateCommon(file, MAX_IMAGE_SIZE, fieldName);
        validateExtension(file, List.of(".jpg", ".jpeg", ".png"));
        validateImageMagicBytes(file);
    }

    private void validateCommon(MultipartFile file, long maxSizeBytes, String fieldName) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException(fieldName + " file is required and cannot be empty.");
        }

        if (file.getSize() > maxSizeBytes) {
            long maxMb = maxSizeBytes / (1024 * 1024);
            throw new RuntimeException(fieldName + " file exceeds the maximum allowed size of " + maxMb + "MB.");
        }

        String originalName = file.getOriginalFilename();
        if (originalName == null || originalName.isBlank()) {
            throw new RuntimeException("Invalid file name.");
        }

        if (originalName.contains("..") || originalName.contains("/") || originalName.contains("\\") || originalName.contains("\0")) {
            throw new RuntimeException("Suspicious file name detected.");
        }
    }

    private void validateExtension(MultipartFile file, List<String> allowedExtensions) {
        String name = file.getOriginalFilename().toLowerCase();
        boolean valid = allowedExtensions.stream().anyMatch(name::endsWith);
        if (!valid) {
            throw new RuntimeException("Invalid file format. Allowed formats: " + String.join(", ", allowedExtensions));
        }
    }

    private void validatePdfMagicBytes(MultipartFile file) {
        try (InputStream is = file.getInputStream()) {
            byte[] header = new byte[PDF_MAGIC.length];
            int read = is.read(header);
            if (read < PDF_MAGIC.length || !Arrays.equals(header, PDF_MAGIC)) {
                throw new RuntimeException("Corrupted or invalid PDF file header detected.");
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to verify file contents.");
        }
    }

    private void validateImageMagicBytes(MultipartFile file) {
        try (InputStream is = file.getInputStream()) {
            byte[] header = new byte[8];
            int read = is.read(header);
            if (read < 3) {
                throw new RuntimeException("Corrupted image file header.");
            }

            boolean isJpeg = header[0] == JPEG_MAGIC[0] && header[1] == JPEG_MAGIC[1] && header[2] == JPEG_MAGIC[2];
            boolean isPng = read >= 8 && Arrays.equals(header, PNG_MAGIC);

            if (!isJpeg && !isPng) {
                throw new RuntimeException("File content does not match a valid JPG or PNG image.");
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to verify image file contents.");
        }
    }
}
