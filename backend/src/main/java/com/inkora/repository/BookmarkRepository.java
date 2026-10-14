package com.inkora.repository;

import com.inkora.entity.Blog;
import com.inkora.entity.Bookmark;
import com.inkora.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    Optional<Bookmark> findByBlogAndUser(Blog blog, User user);

    boolean existsByBlogAndUser(Blog blog, User user);

    void deleteByBlogAndUser(Blog blog, User user);

    Page<Bookmark> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    @Query("SELECT COUNT(bm) FROM Bookmark bm WHERE bm.blog.author = :author")
    long countBookmarksOnAuthorBlogs(@Param("author") User author);
}
