package com.inkora.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialActionResponse {

    private boolean active;
    private long count;
    private String message;

    public boolean isActive() {
        return active;
    }
}
