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
public class CommentResponse {

    private Long id;
    private Long blogId;
    private String content;
    private AuthorSummaryResponse author;
    private boolean isAuthor;
    private Instant createdAt;

    public boolean isAuthor() {
        return isAuthor;
    }
}
