package com.inkora.controller;

import com.inkora.dto.response.ApiResponse;
import com.inkora.dto.response.UploadResponse;
import com.inkora.service.storage.ImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    private final ImageStorageService imageStorageService;

    public UploadController(ImageStorageService imageStorageService) {
        this.imageStorageService = imageStorageService;
    }

    @PostMapping("/image")
    public ResponseEntity<ApiResponse<UploadResponse>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", defaultValue = "content") String category
    ) {
        String imageUrl = imageStorageService.storeImage(file, category);

        UploadResponse response = UploadResponse.builder()
                .url(imageUrl)
                .originalFilename(file.getOriginalFilename())
                .sizeBytes(file.getSize())
                .category(category)
                .build();

        return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully.", response));
    }
}
