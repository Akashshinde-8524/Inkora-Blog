package com.inkora.service.storage;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {

    /**
     * Stores an image file in the designated category folder.
     *
     * @param file the uploaded MultipartFile
     * @param category subfolder category: "profiles", "blogs", or "content"
     * @return the public URL path to access the stored image
     */
    String storeImage(MultipartFile file, String category);

    /**
     * Deletes an image given its public URL or relative path.
     *
     * @param imageUrl the URL of the image to remove
     */
    void deleteImage(String imageUrl);
}
