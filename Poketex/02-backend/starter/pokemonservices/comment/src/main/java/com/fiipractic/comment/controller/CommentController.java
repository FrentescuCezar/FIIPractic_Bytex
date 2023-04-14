package com.fiipractic.comment.controller;

import com.fiipractic.comment.requestmodels.CommentRequest;
import com.fiipractic.comment.service.CommentService;
import com.fiipractic.comment.utils.CommentAlreadyExistsException;
import com.fiipractic.comment.utils.ExtractJWT;
import com.fiipractic.comment.utils.InvalidTokenException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/commentapi/comments")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/")
    public void postComment(@RequestHeader(value = "Authorization") String token, @RequestBody CommentRequest commentRequest) throws InvalidTokenException, CommentAlreadyExistsException {
        String userEmail = ExtractJWT.userEmailExtraction(token);
        commentService.postComment(userEmail, commentRequest);
    }

    @GetMapping("/user/pokemon")
    public boolean userCommentAlreadyExists(@RequestHeader(value = "Authorization") String token, @RequestParam Integer pokemonId) throws InvalidTokenException {
        String userEmail = ExtractJWT.userEmailExtraction(token);
        return commentService.userCommentAlreadyExists(userEmail, pokemonId);
    }

    @GetMapping("/best-rated-pokemon-ids")
    public List<Integer> getBestRatedPokemonIds() {
        return commentService.getBestRatedPokemonIds();
    }

}