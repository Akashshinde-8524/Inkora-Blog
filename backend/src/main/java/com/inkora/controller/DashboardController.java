package com.inkora.controller;

import com.inkora.dto.response.BlogSummaryResponse;
import com.inkora.dto.response.DashboardStatsResponse;
import com.inkora.enums.BlogStatus;
import com.inkora.security.UserPrincipal;
import com.inkora.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final BlogService blogService;

    public DashboardController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        return ResponseEntity.ok(blogService.getDashboardStats(currentUser));
    }

    @GetMapping("/blogs")
    public ResponseEntity<Page<BlogSummaryResponse>> getAuthorBlogs(
            @RequestParam(required = false) BlogStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        return ResponseEntity.ok(blogService.getAuthorBlogs(status, page, size, currentUser));
    }
}
