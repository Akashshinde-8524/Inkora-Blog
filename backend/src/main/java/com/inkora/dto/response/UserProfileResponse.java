package com.inkora.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {

    private Long id;
    private String username;
    private String displayName;
    private String bio;
    private String profileImageUrl;
    private long followersCount;
    private long followingCount;
    private long blogsCount;
    private boolean isFollowing;
    private Instant createdAt;

    public boolean isFollowing() {
        return isFollowing;
    }
}
