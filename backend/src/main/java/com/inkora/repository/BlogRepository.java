package com.inkora.repository;

import com.inkora.entity.Blog;
import com.inkora.entity.User;
import com.inkora.enums.BlogStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {

    Optional<Blog> findBySlug(String slug);

    boolean existsBySlug(String slug);

    Page<Blog> findByStatus(BlogStatus status, Pageable pageable);

    Page<Blog> findByAuthor(User author, Pageable pageable);

    Page<Blog> findByAuthorAndStatus(User author, BlogStatus status, Pageable pageable);

    long countByAuthor(User author);

    long countByAuthorAndStatus(User author, BlogStatus status);

    @Query("SELECT b FROM Blog b WHERE b.status = :status AND " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.excerpt) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.author.displayName) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Blog> searchPublishedBlogs(@Param("query") String query, @Param("status") BlogStatus status, Pageable pageable);

    @Query("SELECT b FROM Blog b JOIN b.tags t WHERE b.status = :status AND t.slug = :tagSlug")
    Page<Blog> findByTagSlugAndStatus(@Param("tagSlug") String tagSlug, @Param("status") BlogStatus status, Pageable pageable);

    @Query("SELECT SUM(b.viewCount) FROM Blog b WHERE b.author = :author")
    Long sumViewsByAuthor(@Param("author") User author);

    @Query("SELECT b FROM Blog b WHERE b.status = :status AND b.author IN (SELECT f.following FROM Follow f WHERE f.follower = :follower)")
    Page<Blog> findFollowingFeed(@Param("follower") User follower, @Param("status") BlogStatus status, Pageable pageable);
}
