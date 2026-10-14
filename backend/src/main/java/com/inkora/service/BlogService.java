package com.inkora.service;

import com.inkora.dto.request.BlogCreateRequest;
import com.inkora.dto.request.BlogUpdateRequest;
import com.inkora.dto.response.AuthorSummaryResponse;
import com.inkora.dto.response.BlogDetailResponse;
import com.inkora.dto.response.BlogSummaryResponse;
import com.inkora.dto.response.DashboardStatsResponse;
import com.inkora.dto.response.TagResponse;
import com.inkora.entity.*;
import com.inkora.enums.BlogStatus;
import com.inkora.enums.BlogStyle;
import com.inkora.exception.ResourceNotFoundException;
import com.inkora.exception.UnauthorizedException;
import com.inkora.repository.*;
import com.inkora.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@SuppressWarnings("null")
public class BlogService {

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final BookmarkRepository bookmarkRepository;
    private final CommentRepository commentRepository;
    private final BlogViewRepository blogViewRepository;
    private final TagService tagService;

    public BlogService(BlogRepository blogRepository,
                       UserRepository userRepository,
                       LikeRepository likeRepository,
                       BookmarkRepository bookmarkRepository,
                       CommentRepository commentRepository,
                       BlogViewRepository blogViewRepository,
                       TagService tagService) {
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.commentRepository = commentRepository;
        this.blogViewRepository = blogViewRepository;
        this.tagService = tagService;
    }

    @Transactional
    public BlogDetailResponse createBlog(BlogCreateRequest request, UserPrincipal currentUser) {
        User author = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        String slug = generateUniqueSlug(request.getTitle());

        String excerpt = request.getExcerpt();
        if (excerpt == null || excerpt.trim().isEmpty()) {
            excerpt = generateExcerpt(request.getContent());
        }

        Instant publishedAt = null;
        if (request.getStatus() == BlogStatus.PUBLISHED) {
            publishedAt = Instant.now();
        }

        Set<Tag> tags = tagService.findOrCreateTags(request.getTags());

        Blog blog = Blog.builder()
                .author(author)
                .title(request.getTitle().trim())
                .slug(slug)
                .excerpt(excerpt)
                .content(request.getContent())
                .coverImageUrl(request.getCoverImageUrl())
                .style(request.getStyle() != null ? request.getStyle() : BlogStyle.EDITORIAL)
                .status(request.getStatus() != null ? request.getStatus() : BlogStatus.DRAFT)
                .publishedAt(publishedAt)
                .tags(tags)
                .viewCount(0L)
                .build();

        Blog savedBlog = blogRepository.save(blog);
        return mapToDetailResponse(savedBlog, currentUser);
    }

    @Transactional
    public BlogDetailResponse updateBlog(Long id, BlogUpdateRequest request, UserPrincipal currentUser) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id));

        // Ownership Check: Only author can edit their own blog
        if (!blog.getAuthor().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to edit this blog.");
        }

        // If title changed, update slug
        if (!blog.getTitle().equalsIgnoreCase(request.getTitle().trim())) {
            blog.setTitle(request.getTitle().trim());
            blog.setSlug(generateUniqueSlug(request.getTitle()));
        }

        String excerpt = request.getExcerpt();
        if (excerpt == null || excerpt.trim().isEmpty()) {
            excerpt = generateExcerpt(request.getContent());
        }
        blog.setExcerpt(excerpt);
        blog.setContent(request.getContent());
        blog.setCoverImageUrl(request.getCoverImageUrl());

        if (request.getStyle() != null) {
            blog.setStyle(request.getStyle());
        }

        if (request.getStatus() != null) {
            if (request.getStatus() == BlogStatus.PUBLISHED && blog.getPublishedAt() == null) {
                blog.setPublishedAt(Instant.now());
            }
            blog.setStatus(request.getStatus());
        }

        if (request.getTags() != null) {
            blog.setTags(tagService.findOrCreateTags(request.getTags()));
        }

        Blog updatedBlog = blogRepository.save(blog);
        return mapToDetailResponse(updatedBlog, currentUser);
    }

    @Transactional
    public void deleteBlog(Long id, UserPrincipal currentUser) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id));

        // Ownership Check: Only author can delete their own blog
        if (!blog.getAuthor().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this blog.");
        }

        blogRepository.delete(blog);
    }

    @Transactional
    public BlogDetailResponse publishBlog(Long id, UserPrincipal currentUser) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id));

        if (!blog.getAuthor().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to publish this blog.");
        }

        blog.setStatus(BlogStatus.PUBLISHED);
        if (blog.getPublishedAt() == null) {
            blog.setPublishedAt(Instant.now());
        }

        return mapToDetailResponse(blogRepository.save(blog), currentUser);
    }

    @Transactional
    public BlogDetailResponse unpublishBlog(Long id, UserPrincipal currentUser) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id));

        if (!blog.getAuthor().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to unpublish this blog.");
        }

        blog.setStatus(BlogStatus.DRAFT);
        return mapToDetailResponse(blogRepository.save(blog), currentUser);
    }

    @Transactional
    public BlogDetailResponse getBlogBySlug(String slug, String clientIp, UserPrincipal currentUser) {
        Blog blog = blogRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "slug", slug));

        boolean isAuthor = currentUser != null && blog.getAuthor().getId().equals(currentUser.getId());

        // Draft Protection: Drafts are viewable ONLY by their author
        if (blog.getStatus() == BlogStatus.DRAFT && !isAuthor) {
            throw new UnauthorizedException("This blog is currently a draft and can only be viewed by its author.");
        }

        // View Counting with IP Deduplication (2-hour cooldown window)
        if (blog.getStatus() == BlogStatus.PUBLISHED) {
            trackSensibleView(blog, clientIp, currentUser);
        }

        return mapToDetailResponse(blog, currentUser);
    }

    @Transactional(readOnly = true)
    public BlogDetailResponse getBlogById(Long id, UserPrincipal currentUser) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id));

        boolean isAuthor = currentUser != null && blog.getAuthor().getId().equals(currentUser.getId());
        if (blog.getStatus() == BlogStatus.DRAFT && !isAuthor) {
            throw new UnauthorizedException("You are not authorized to view this draft.");
        }

        return mapToDetailResponse(blog, currentUser);
    }

    @Transactional(readOnly = true)
    public Page<BlogSummaryResponse> getExploreBlogs(String tab, String tag, int page, int size, UserPrincipal currentUser) {
        Sort sort = Sort.by(Sort.Direction.DESC, "publishedAt");

        if ("trending".equalsIgnoreCase(tab) || "popular".equalsIgnoreCase(tab)) {
            sort = Sort.by(Sort.Direction.DESC, "viewCount", "publishedAt");
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Blog> blogPage;

        if (tag != null && !tag.trim().isEmpty()) {
            String tagSlug = TagService.slugify(tag);
            blogPage = blogRepository.findByTagSlugAndStatus(tagSlug, BlogStatus.PUBLISHED, pageable);
        } else {
            blogPage = blogRepository.findByStatus(BlogStatus.PUBLISHED, pageable);
        }

        return blogPage.map(blog -> mapToSummaryResponse(blog, currentUser));
    }

    @Transactional(readOnly = true)
    public Page<BlogSummaryResponse> searchBlogs(String query, int page, int size, UserPrincipal currentUser) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt"));
        Page<Blog> results = blogRepository.searchPublishedBlogs(query.trim(), BlogStatus.PUBLISHED, pageable);
        return results.map(blog -> mapToSummaryResponse(blog, currentUser));
    }

    @Transactional(readOnly = true)
    public Page<BlogSummaryResponse> getAuthorBlogs(BlogStatus status, int page, int size, UserPrincipal currentUser) {
        User author = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Blog> blogPage;
        if (status != null) {
            blogPage = blogRepository.findByAuthorAndStatus(author, status, pageable);
        } else {
            blogPage = blogRepository.findByAuthor(author, pageable);
        }

        return blogPage.map(blog -> mapToSummaryResponse(blog, currentUser));
    }

    @Transactional(readOnly = true)
    public Page<BlogSummaryResponse> getUserPublishedBlogs(String username, int page, int size, UserPrincipal currentUser) {
        User author = userRepository.findByUsername(username.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt"));
        Page<Blog> blogPage = blogRepository.findByAuthorAndStatus(author, BlogStatus.PUBLISHED, pageable);
        return blogPage.map(blog -> mapToSummaryResponse(blog, currentUser));
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats(UserPrincipal currentUser) {
        User author = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        long totalBlogs = blogRepository.countByAuthor(author);
        long publishedBlogs = blogRepository.countByAuthorAndStatus(author, BlogStatus.PUBLISHED);
        long draftBlogs = blogRepository.countByAuthorAndStatus(author, BlogStatus.DRAFT);
        Long totalViews = blogRepository.sumViewsByAuthor(author);
        long totalLikes = likeRepository.countLikesOnAuthorBlogs(author);
        long totalComments = commentRepository.countCommentsOnAuthorBlogs(author);

        return DashboardStatsResponse.builder()
                .totalBlogs(totalBlogs)
                .publishedBlogs(publishedBlogs)
                .draftBlogs(draftBlogs)
                .totalViews(totalViews != null ? totalViews : 0L)
                .totalLikes(totalLikes)
                .totalComments(totalComments)
                .build();
    }

    private void trackSensibleView(Blog blog, String clientIp, UserPrincipal currentUser) {
        String ip = (clientIp != null && !clientIp.isBlank()) ? clientIp : "127.0.0.1";
        String ipHash = hashIp(ip);
        Instant twoHoursAgo = Instant.now().minus(2, ChronoUnit.HOURS);

        boolean alreadyViewedRecently = blogViewRepository.existsByBlogAndIpHashAndViewedAtAfter(blog, ipHash, twoHoursAgo);

        if (!alreadyViewedRecently) {
            User viewingUser = null;
            if (currentUser != null) {
                viewingUser = userRepository.findById(currentUser.getId()).orElse(null);
            }

            BlogView view = BlogView.builder()
                    .blog(blog)
                    .user(viewingUser)
                    .ipHash(ipHash)
                    .build();

            blogViewRepository.save(view);
            blog.setViewCount(blog.getViewCount() + 1);
            blogRepository.save(blog);
        }
    }

    private String generateUniqueSlug(String title) {
        String baseSlug = TagService.slugify(title);
        if (baseSlug.isEmpty()) {
            baseSlug = "story";
        }

        String slug = baseSlug;
        int counter = 1;
        while (blogRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter;
            counter++;
        }
        return slug;
    }

    private String generateExcerpt(String content) {
        if (content == null) return "";
        // Strip markdown characters for a clean plain-text excerpt
        String plain = content.replaceAll("[#*`_\\[\\]()>-]", " ").replaceAll("\\s+", " ").trim();
        return plain.length() > 160 ? plain.substring(0, 157) + "..." : plain;
    }

    private int calculateReadingTime(String content) {
        if (content == null || content.isBlank()) return 1;
        int words = content.trim().split("\\s+").length;
        return Math.max(1, (int) Math.ceil(words / 200.0));
    }

    private String hashIp(String ip) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(ip.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            return Integer.toHexString(ip.hashCode());
        }
    }

    public BlogSummaryResponse mapToSummaryResponse(Blog blog, UserPrincipal currentUser) {
        User user = currentUser != null ? userRepository.findById(currentUser.getId()).orElse(null) : null;

        boolean isLiked = user != null && likeRepository.existsByBlogAndUser(blog, user);
        boolean isBookmarked = user != null && bookmarkRepository.existsByBlogAndUser(blog, user);
        long likesCount = likeRepository.countByBlog(blog);
        long commentsCount = commentRepository.countByBlog(blog);

        List<TagResponse> tags = blog.getTags().stream()
                .map(t -> new TagResponse(t.getId(), t.getName(), t.getSlug()))
                .collect(Collectors.toList());

        AuthorSummaryResponse author = AuthorSummaryResponse.builder()
                .id(blog.getAuthor().getId())
                .username(blog.getAuthor().getUsername())
                .displayName(blog.getAuthor().getDisplayName())
                .bio(blog.getAuthor().getBio())
                .profileImageUrl(blog.getAuthor().getProfileImageUrl())
                .build();

        return BlogSummaryResponse.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .slug(blog.getSlug())
                .excerpt(blog.getExcerpt())
                .coverImageUrl(blog.getCoverImageUrl())
                .style(blog.getStyle())
                .status(blog.getStatus())
                .publishedAt(blog.getPublishedAt())
                .createdAt(blog.getCreatedAt())
                .viewCount(blog.getViewCount())
                .readingTimeMinutes(calculateReadingTime(blog.getContent()))
                .author(author)
                .tags(tags)
                .likesCount(likesCount)
                .commentsCount(commentsCount)
                .isLikedByCurrentUser(isLiked)
                .isBookmarkedByCurrentUser(isBookmarked)
                .build();
    }

    public BlogDetailResponse mapToDetailResponse(Blog blog, UserPrincipal currentUser) {
        BlogSummaryResponse summary = mapToSummaryResponse(blog, currentUser);
        boolean isAuthor = currentUser != null && blog.getAuthor().getId().equals(currentUser.getId());

        return BlogDetailResponse.builder()
                .id(summary.getId())
                .title(summary.getTitle())
                .slug(summary.getSlug())
                .excerpt(summary.getExcerpt())
                .content(blog.getContent())
                .coverImageUrl(summary.getCoverImageUrl())
                .style(summary.getStyle())
                .status(summary.getStatus())
                .publishedAt(summary.getPublishedAt())
                .createdAt(summary.getCreatedAt())
                .updatedAt(blog.getUpdatedAt())
                .viewCount(summary.getViewCount())
                .readingTimeMinutes(summary.getReadingTimeMinutes())
                .author(summary.getAuthor())
                .tags(summary.getTags())
                .likesCount(summary.getLikesCount())
                .commentsCount(summary.getCommentsCount())
                .isLikedByCurrentUser(summary.isLikedByCurrentUser())
                .isBookmarkedByCurrentUser(summary.isBookmarkedByCurrentUser())
                .isAuthor(isAuthor)
                .build();
    }
}
