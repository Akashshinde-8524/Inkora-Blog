package com.inkora.dto.request;

import com.inkora.enums.BlogStatus;
import com.inkora.enums.BlogStyle;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogUpdateRequest {

    @NotBlank(message = "Blog title is required")
    @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
    private String title;

    private String excerpt;

    @NotBlank(message = "Blog content cannot be empty")
    private String content;

    private String coverImageUrl;

    private BlogStyle style;

    private BlogStatus status;

    @Builder.Default
    private Set<String> tags = new HashSet<>();
}
