package com.inkora.repository;

import com.inkora.entity.Blog;
import com.inkora.entity.Comment;
import com.inkora.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByBlogOrderByCreatedAtDesc(Blog blog);

    Page<Comment> findByBlogOrderByCreatedAtDesc(Blog blog, Pageable pageable);

    long countByBlog(Blog blog);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.blog.author = :author")
    long countCommentsOnAuthorBlogs(@Param("author") User author);
}
