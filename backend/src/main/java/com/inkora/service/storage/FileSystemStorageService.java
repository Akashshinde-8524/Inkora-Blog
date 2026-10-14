package com.inkora.service.storage;

import com.inkora.exception.BadRequestException;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class FileSystemStorageService implements ImageStorageService {

    @Value("${inkora.upload.dir:./uploads}")
    private String rootUploadDir;

    @Value("${inkora.upload.max-file-size:10485760}")
    private long maxFileSize;

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
    );

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            ".jpg", ".jpeg", ".png", ".webp", ".gif"
    );

    private Path rootPath;

    @PostConstruct
    public void init() {
        this.rootPath = Paths.get(rootUploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.rootPath);
            Files.createDirectories(this.rootPath.resolve("profiles"));
            Files.createDirectories(this.rootPath.resolve("blogs"));
            Files.createDirectories(this.rootPath.resolve("content"));
            log.info("Image upload directories initialized at: {}", this.rootPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage directory", e);
        }
    }

    @Override
    public String storeImage(MultipartFile file, String category) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Failed to store empty image file.");
        }

        if (file.getSize() > maxFileSize) {
            throw new BadRequestException("Image file size exceeds maximum limit of " + (maxFileSize / (1024 * 1024)) + "MB.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Invalid file format. Only JPEG, PNG, WEBP, and GIF images are allowed.");
        }

        String rawFilename = file.getOriginalFilename();
        if (rawFilename == null || rawFilename.isBlank()) {
            rawFilename = "image.jpg";
        }
        String originalFilename = StringUtils.cleanPath(rawFilename);
        String extension = getFileExtension(originalFilename);

        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new BadRequestException("Invalid file extension: '" + extension + "'. Allowed: " + ALLOWED_EXTENSIONS);
        }

        // Sanitize category folder: must be profiles, blogs, or content
        String safeCategory = "content";
        if ("profiles".equalsIgnoreCase(category) || "avatars".equalsIgnoreCase(category)) {
            safeCategory = "profiles";
        } else if ("blogs".equalsIgnoreCase(category)) {
            safeCategory = "blogs";
        }

        String uniqueFilename = UUID.randomUUID().toString() + extension.toLowerCase();
        Path targetCategoryPath = this.rootPath.resolve(safeCategory).normalize();
        Path destinationFile = targetCategoryPath.resolve(uniqueFilename).normalize();

        // Path Traversal Security check
        if (!destinationFile.getParent().equals(targetCategoryPath)) {
            throw new BadRequestException("Cannot store file outside target directory.");
        }

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            log.info("Saved image: {} in category: {}", uniqueFilename, safeCategory);
        } catch (IOException e) {
            log.error("Failed to store file: {}", originalFilename, e);
            throw new RuntimeException("Failed to save image file on server.", e);
        }

        // Return public relative URL matching WebMvcConfig handler: /uploads/{category}/{filename}
        return "/uploads/" + safeCategory + "/" + uniqueFilename;
    }

    @Override
    public void deleteImage(String imageUrl) {
        if (imageUrl == null || !imageUrl.startsWith("/uploads/")) {
            return;
        }

        try {
            String relativePath = imageUrl.substring("/uploads/".length());
            Path targetFile = this.rootPath.resolve(relativePath).normalize();

            if (targetFile.startsWith(this.rootPath)) {
                Files.deleteIfExists(targetFile);
                log.info("Deleted image: {}", targetFile);
            }
        } catch (IOException e) {
            log.warn("Could not delete image: {}", imageUrl, e);
        }
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex == -1) ? "" : filename.substring(dotIndex);
    }
}
