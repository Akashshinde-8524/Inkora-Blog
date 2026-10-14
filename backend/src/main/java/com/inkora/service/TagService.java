package com.inkora.service;

import com.inkora.dto.response.TagResponse;
import com.inkora.entity.Tag;
import com.inkora.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @Transactional
    public Set<Tag> findOrCreateTags(Set<String> tagNames) {
        if (tagNames == null || tagNames.isEmpty()) {
            return new HashSet<>();
        }

        Set<Tag> tags = new HashSet<>();
        for (String rawName : tagNames) {
            if (rawName == null || rawName.trim().isEmpty()) continue;

            String name = rawName.trim();
            String slug = slugify(name);

            Tag tag = tagRepository.findBySlug(slug)
                    .orElseGet(() -> tagRepository.save(
                            Tag.builder()
                                    .name(name)
                                    .slug(slug)
                                    .build()
                    ));

            tags.add(tag);
        }

        return tags;
    }

    public static String slugify(String input) {
        if (input == null) return "";
        return input.trim()
                .toLowerCase(Locale.ENGLISH)
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

    @Transactional(readOnly = true)
    public List<TagResponse> getAllTags() {
        return tagRepository.findAll().stream()
                .map(t -> TagResponse.builder()
                        .id(t.getId())
                        .name(t.getName())
                        .slug(t.getSlug())
                        .build())
                .collect(Collectors.toList());
    }
}
