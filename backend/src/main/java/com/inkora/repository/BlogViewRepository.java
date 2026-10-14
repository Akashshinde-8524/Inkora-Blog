package com.inkora.repository;

import com.inkora.entity.Blog;
import com.inkora.entity.BlogView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
public interface BlogViewRepository extends JpaRepository<BlogView, Long> {

    boolean existsByBlogAndIpHashAndViewedAtAfter(Blog blog, String ipHash, Instant after);
}
