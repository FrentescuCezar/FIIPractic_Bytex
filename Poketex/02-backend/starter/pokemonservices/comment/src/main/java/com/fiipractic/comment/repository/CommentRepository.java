package com.fiipractic.comment.repository;

import com.fiipractic.comment.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Integer> {


    Page<Comment> findByPokemonId(@RequestParam("book_id") Integer pokemonId, Pageable pageable);

    @Query(value = "SELECT pokemon_id, AVG(rating) as average_rating, COUNT(*) as total_comments, " +
            "AVG(rating) * (1 - 1 / EXP(COUNT(*) / 10.0)) as weighted_rating " +
            "FROM comment " +
            "GROUP BY pokemon_id " +
            "ORDER BY weighted_rating DESC", nativeQuery = true)
    List<Object[]> findBestRatedPokemonIds();

    Comment findByUserNameAndPokemonId(String userEmail, Integer pokemonId);

}
