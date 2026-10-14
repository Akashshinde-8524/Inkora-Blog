package com.inkora.service;

import com.inkora.dto.response.AuthorSummaryResponse;
import com.inkora.dto.response.BlogSummaryResponse;
import com.inkora.dto.response.FollowResponse;
import com.inkora.dto.response.SocialActionResponse;
import com.inkora.dto.response.TagResponse;
import com.inkora.entity.Blog;
import com.inkora.entity.Bookmark;
import com.inkora.entity.Follow;
import com.inkora.entity.Like;
import com.inkora.entity.User;
import com.inkora.enums.BlogStatus;
import com.inkora.exception.BadRequestException;
import com.inkora.exception.ResourceNotFoundException;
import com.inkora.repository.BlogRepository;
import com.inkora.repository.BookmarkRepository;
import com.inkora.repository.CommentRepository;
import com.inkora.repository.FollowRepository;
import com.inkora.repository.LikeRepository;
import com.inkora.repository.UserRepository;
import com.inkora.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@SuppressWarnings("null")
public class SocialService {

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final BookmarkRepository bookmarkRepository;
    private final CommentRepository commentRepository;
    private final FollowRepository followRepository;

    public SocialService(BlogRepository blogRepository,
                         UserRepository userRepository,
                         LikeRepository likeRepository,
                         BookmarkRepository bookmarkRepository,
                         CommentRepository commentRepository,
                         FollowRepository followRepository) {
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.commentRepository = commentRepository;
        this.followRepository = followRepository;
    }

    @Transactional
    public SocialActionResponse toggleLike(Long blogId, UserPrincipal currentUser) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", blogId));

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        Optional<Like> existingLike = likeRepository.findByBlogAndUser(blog, user);
        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            long count = likeRepository.countByBlog(blog);
            return SocialActionResponse.builder()
                    .active(false)
                    .count(count)
                    .message("Story unliked.")
                    .build();
        } else {
            Like like = Like.builder()
                    .blog(blog)
                    .user(user)
                    .build();
            likeRepository.save(like);
            long count = likeRepository.countByBlog(blog);
            return SocialActionResponse.builder()
                    .active(true)
                    .count(count)
                    .message("Story liked.")
                    .build();
        }
    }

    @Transactional
    public SocialActionResponse toggleBookmark(Long blogId, UserPrincipal currentUser) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", blogId));

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        Optional<Bookmark> existingBookmark = bookmarkRepository.findByBlogAndUser(blog, user);
        if (existingBookmark.isPresent()) {
            bookmarkRepository.delete(existingBookmark.get());
            return SocialActionResponse.builder()
                    .active(false)
                    .count(0)
                    .message("Story removed from bookmarks.")
                    .build();
        } else {
            Bookmark bookmark = Bookmark.builder()
                    .blog(blog)
                    .user(user)
                    .build();
            bookmarkRepository.save(bookmark);
            return SocialActionResponse.builder()
                    .active(true)
                    .count(0)
                    .message("Story saved to bookmarks.")
                    .build();
        }
    }

    @Transactional(readOnly = true)
    public Page<BlogSummaryResponse> getUserBookmarks(int page, int size, UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        Pageable pageable = PageRequest.of(page, size);
        Page<Bookmark> bookmarkPage = bookmarkRepository.findByUserOrderByCreatedAtDesc(user, pageable);

        return bookmarkPage.map(bm -> mapBlogToSummary(bm.getBlog(), currentUser));
    }

    @Transactional
    public FollowResponse toggleFollow(String username, UserPrincipal currentUser) {
        User targetUser = userRepository.findByUsername(username.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        User follower = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        if (follower.getId().equals(targetUser.getId())) {
            throw new BadRequestException("You cannot follow yourself.");
        }

        Optional<Follow> existingFollow = followRepository.findByFollowerAndFollowing(follower, targetUser);
        if (existingFollow.isPresent()) {
            followRepository.delete(existingFollow.get());
            long followersCount = followRepository.countByFollowing(targetUser);
            return FollowResponse.builder()
                    .following(false)
                    .followersCount(followersCount)
                    .message("Unfollowed @" + targetUser.getUsername())
                    .build();
        } else {
            Follow follow = Follow.builder()
                    .follower(follower)
                    .following(targetUser)
                    .build();
            followRepository.save(follow);
            long followersCount = followRepository.countByFollowing(targetUser);
            return FollowResponse.builder()
                    .following(true)
                    .followersCount(followersCount)
                    .message("Following @" + targetUser.getUsername())
                    .build();
        }
    }

    @Transactional(readOnly = true)
    public Page<BlogSummaryResponse> getFollowingFeed(int page, int size, UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt"));
        Page<Blog> blogPage = blogRepository.findFollowingFeed(user, BlogStatus.PUBLISHED, pageable);

        return blogPage.map(blog -> mapBlogToSummary(blog, currentUser));
    }

    private BlogSummaryResponse mapBlogToSummary(Blog blog, UserPrincipal currentUser) {
        long likesCount = likeRepository.countByBlog(blog);
        long commentsCount = commentRepository.countByBlog(blog);

        boolean likedByCurrentUser = false;
        boolean bookmarkedByCurrentUser = false;

        if (currentUser != null) {
            User current = userRepository.findById(currentUser.getId()).orElse(null);
            if (current != null) {
                likedByCurrentUser = likeRepository.existsByBlogAndUser(blog, current);
                bookmarkedByCurrentUser = bookmarkRepository.existsByBlogAndUser(blog, current);
            }
        }

        int wordCount = blog.getContent() != null ? blog.getContent().split("\\s+").length : 0;
        int readingTimeMinutes = Math.max(1, (int) Math.ceil(wordCount / 200.0));

        return BlogSummaryResponse.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .slug(blog.getSlug())
                .excerpt(blog.getExcerpt())
                .coverImageUrl(blog.getCoverImageUrl())
                .style(blog.getStyle())
                .status(blog.getStatus())
                .viewCount(blog.getViewCount())
                .likesCount(likesCount)
                .commentsCount(commentsCount)
                .readingTimeMinutes(readingTimeMinutes)
                .isLikedByCurrentUser(likedByCurrentUser)
                .isBookmarkedByCurrentUser(bookmarkedByCurrentUser)
                .author(AuthorSummaryResponse.builder()
                        .id(blog.getAuthor().getId())
                        .username(blog.getAuthor().getUsername())
                        .displayName(blog.getAuthor().getDisplayName())
                        .profileImageUrl(blog.getAuthor().getProfileImageUrl())
                        .bio(blog.getAuthor().getBio())
                        .build())
                .tags(blog.getTags().stream()
                        .map(t -> TagResponse.builder().id(t.getId()).name(t.getName()).slug(t.getSlug()).build())
                        .collect(Collectors.toList()))
                .publishedAt(blog.getPublishedAt())
                .createdAt(blog.getCreatedAt())
                .build();
    }
}
