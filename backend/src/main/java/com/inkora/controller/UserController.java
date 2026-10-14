package com.inkora.controller;

import com.inkora.dto.request.ProfileUpdateRequest;
import com.inkora.dto.response.BlogSummaryResponse;
import com.inkora.dto.response.UserProfileResponse;
import com.inkora.security.UserPrincipal;
import com.inkora.service.BlogService;
import com.inkora.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final BlogService blogService;

    public UserController(UserService userService, BlogService blogService) {
        this.userService = userService;
        this.blogService = blogService;
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @Valid @RequestBody ProfileUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        return ResponseEntity.ok(userService.updateProfile(request, currentUser));
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserProfileResponse> getUserProfile(
            @PathVariable String username,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        return ResponseEntity.ok(userService.getUserProfile(username, currentUser));
    }

    @GetMapping("/{username}/blogs")
    public ResponseEntity<Page<BlogSummaryResponse>> getUserBlogs(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        return ResponseEntity.ok(blogService.getUserPublishedBlogs(username, page, size, currentUser));
    }
}
