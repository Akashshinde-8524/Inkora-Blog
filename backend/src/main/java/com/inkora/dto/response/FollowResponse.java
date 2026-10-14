package com.inkora.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowResponse {

    private boolean following;
    private long followersCount;
    private String message;

    public boolean isFollowing() {
        return following;
    }
}
