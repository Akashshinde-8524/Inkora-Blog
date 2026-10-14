package com.inkora.controller;

import com.inkora.dto.request.CommentCreateRequest;
import com.inkora.dto.response.ApiResponse;
import com.inkora.dto.response.CommentResponse;
import com.inkora.security.UserPrincipal;
import com.inkora.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/blogs/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getBlogComments(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        return ResponseEntity.ok(commentService.getBlogComments(id, currentUser));
    }

    @PostMapping("/blogs/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentCreateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        return new ResponseEntity<>(
                commentService.addComment(id, request, currentUser),
                HttpStatus.CREATED
        );
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        commentService.deleteComment(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Comment deleted successfully.", null));
    }
}
