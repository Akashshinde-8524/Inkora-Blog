package com.inkora.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorSummaryResponse {
    private Long id;
    private String username;
    private String displayName;
    private String bio;
    private String profileImageUrl;
}
