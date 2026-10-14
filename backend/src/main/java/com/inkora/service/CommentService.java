package com.inkora.service;

import com.inkora.dto.request.CommentCreateRequest;
import com.inkora.dto.response.AuthorSummaryResponse;
import com.inkora.dto.response.CommentResponse;
import com.inkora.entity.Blog;
import com.inkora.entity.Comment;
import com.inkora.entity.User;
import com.inkora.exception.ResourceNotFoundException;
import com.inkora.exception.UnauthorizedException;
import com.inkora.repository.BlogRepository;
import com.inkora.repository.CommentRepository;
import com.inkora.repository.UserRepository;
import com.inkora.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@SuppressWarnings("null")
public class CommentService {

    private final CommentRepository commentRepository;
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository,
                          BlogRepository blogRepository,
                          UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getBlogComments(Long blogId, UserPrincipal currentUser) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", blogId));

        List<Comment> comments = commentRepository.findByBlogOrderByCreatedAtDesc(blog);

        return comments.stream()
                .map(comment -> mapToCommentResponse(comment, currentUser))
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse addComment(Long blogId, CommentCreateRequest request, UserPrincipal currentUser) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", blogId));

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        Comment comment = Comment.builder()
                .blog(blog)
                .user(user)
                .content(request.getContent().trim())
                .build();

        Comment savedComment = commentRepository.save(comment);
        return mapToCommentResponse(savedComment, currentUser);
    }

    @Transactional
    public void deleteComment(Long commentId, UserPrincipal currentUser) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        boolean isCommentAuthor = comment.getUser().getId().equals(currentUser.getId());
        boolean isBlogAuthor = comment.getBlog().getAuthor().getId().equals(currentUser.getId());

        if (!isCommentAuthor && !isBlogAuthor) {
            throw new UnauthorizedException("You are not authorized to delete this comment.");
        }

        commentRepository.delete(comment);
    }

    private CommentResponse mapToCommentResponse(Comment comment, UserPrincipal currentUser) {
        boolean isAuthor = currentUser != null && comment.getUser().getId().equals(currentUser.getId());

        return CommentResponse.builder()
                .id(comment.getId())
                .blogId(comment.getBlog().getId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .isAuthor(isAuthor)
                .author(AuthorSummaryResponse.builder()
                        .id(comment.getUser().getId())
                        .username(comment.getUser().getUsername())
                        .displayName(comment.getUser().getDisplayName())
                        .profileImageUrl(comment.getUser().getProfileImageUrl())
                        .bio(comment.getUser().getBio())
                        .build())
                .build();
    }
}
