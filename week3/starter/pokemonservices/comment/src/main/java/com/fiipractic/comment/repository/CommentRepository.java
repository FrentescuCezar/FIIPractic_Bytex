package com.fiipractic.comment.repository;

import com.fiipractic.comment.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.web.bind.annotation.RequestParam;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

    Page<Comment> findByPokemonId(@RequestParam("book_id") Integer pokemonId, Pageable pageable);

    Comment findByUserEmailAndPokemonId(String userEmail, Integer pokemonId);

}
