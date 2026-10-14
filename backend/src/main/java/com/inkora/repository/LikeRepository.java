package com.inkora.repository;

import com.inkora.entity.Blog;
import com.inkora.entity.Like;
import com.inkora.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByBlogAndUser(Blog blog, User user);

    boolean existsByBlogAndUser(Blog blog, User user);

    long countByBlog(Blog blog);

    void deleteByBlogAndUser(Blog blog, User user);

    @Query("SELECT COUNT(l) FROM Like l WHERE l.blog.author = :author")
    long countLikesOnAuthorBlogs(@Param("author") User author);
}
