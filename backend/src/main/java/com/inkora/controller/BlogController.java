package com.inkora.controller;

import com.inkora.dto.request.BlogCreateRequest;
import com.inkora.dto.request.BlogUpdateRequest;
import com.inkora.dto.response.ApiResponse;
import com.inkora.dto.response.BlogDetailResponse;
import com.inkora.dto.response.BlogSummaryResponse;
import com.inkora.security.UserPrincipal;
import com.inkora.service.BlogService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BlogDetailResponse>> createBlog(
            @Valid @RequestBody BlogCreateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        BlogDetailResponse createdBlog = blogService.createBlog(request, currentUser);
        return new ResponseEntity<>(
                ApiResponse.success("Blog created successfully.", createdBlog),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogDetailResponse>> updateBlog(
            @PathVariable Long id,
            @Valid @RequestBody BlogUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        BlogDetailResponse updatedBlog = blogService.updateBlog(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Blog updated successfully.", updatedBlog));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBlog(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        blogService.deleteBlog(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Blog deleted successfully.", null));
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<BlogDetailResponse>> publishBlog(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        BlogDetailResponse published = blogService.publishBlog(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Blog published successfully.", published));
    }

    @PostMapping("/{id}/unpublish")
    public ResponseEntity<ApiResponse<BlogDetailResponse>> unpublishBlog(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        BlogDetailResponse unpublished = blogService.unpublishBlog(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Blog unpublished and moved to drafts.", unpublished));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<BlogDetailResponse> getBlogBySlug(
            @PathVariable String slug,
            HttpServletRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isBlank()) {
            clientIp = request.getRemoteAddr();
        }
        return ResponseEntity.ok(blogService.getBlogBySlug(slug, clientIp, currentUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogDetailResponse> getBlogById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        return ResponseEntity.ok(blogService.getBlogById(id, currentUser));
    }

    @GetMapping("/explore")
    public ResponseEntity<Page<BlogSummaryResponse>> getExploreFeed(
            @RequestParam(required = false, defaultValue = "latest") String tab,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        return ResponseEntity.ok(blogService.getExploreBlogs(tab, tag, page, size, currentUser));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<BlogSummaryResponse>> searchBlogs(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        return ResponseEntity.ok(blogService.searchBlogs(q, page, size, currentUser));
    }
}
