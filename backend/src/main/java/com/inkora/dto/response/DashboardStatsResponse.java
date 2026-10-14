package com.inkora.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {

    private long totalBlogs;
    private long publishedBlogs;
    private long draftBlogs;
    private long totalViews;
    private long totalLikes;
    private long totalComments;
}
