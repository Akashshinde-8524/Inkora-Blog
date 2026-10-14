package com.inkora.dto.response;

import com.inkora.enums.BlogStatus;
import com.inkora.enums.BlogStyle;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogSummaryResponse {

    private Long id;
    private String title;
    private String slug;
    private String excerpt;
    private String coverImageUrl;
    private BlogStyle style;
    private BlogStatus status;
    private Instant publishedAt;
    private Instant createdAt;
    private Long viewCount;
    private int readingTimeMinutes;

    private AuthorSummaryResponse author;
    private List<TagResponse> tags;

    private long likesCount;
    private long commentsCount;

    private boolean isLikedByCurrentUser;
    private boolean isBookmarkedByCurrentUser;

    public boolean isLikedByCurrentUser() {
        return isLikedByCurrentUser;
    }

    public void setLikedByCurrentUser(boolean isLikedByCurrentUser) {
        this.isLikedByCurrentUser = isLikedByCurrentUser;
    }

    public boolean isBookmarkedByCurrentUser() {
        return isBookmarkedByCurrentUser;
    }

    public void setBookmarkedByCurrentUser(boolean isBookmarkedByCurrentUser) {
        this.isBookmarkedByCurrentUser = isBookmarkedByCurrentUser;
    }
}
