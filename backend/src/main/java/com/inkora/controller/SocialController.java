package com.inkora.controller;

import com.inkora.dto.response.BlogSummaryResponse;
import com.inkora.dto.response.FollowResponse;
import com.inkora.dto.response.SocialActionResponse;
import com.inkora.security.UserPrincipal;
import com.inkora.service.SocialService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SocialController {

    private final SocialService socialService;

    public SocialController(SocialService socialService) {
        this.socialService = socialService;
    }

    @PostMapping("/blogs/{id}/like")
    public ResponseEntity<SocialActionResponse> toggleLike(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        return ResponseEntity.ok(socialService.toggleLike(id, currentUser));
    }

    @PostMapping("/blogs/{id}/bookmark")
    public ResponseEntity<SocialActionResponse> toggleBookmark(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        return ResponseEntity.ok(socialService.toggleBookmark(id, currentUser));
    }

    @GetMapping("/dashboard/bookmarks")
    public ResponseEntity<Page<BlogSummaryResponse>> getUserBookmarks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        return ResponseEntity.ok(socialService.getUserBookmarks(page, size, currentUser));
    }

    @PostMapping("/users/{username}/follow")
    public ResponseEntity<FollowResponse> toggleFollow(
            @PathVariable String username,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        return ResponseEntity.ok(socialService.toggleFollow(username, currentUser));
    }

    @GetMapping("/blogs/feed")
    public ResponseEntity<Page<BlogSummaryResponse>> getFollowingFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        return ResponseEntity.ok(socialService.getFollowingFeed(page, size, currentUser));
    }
}
