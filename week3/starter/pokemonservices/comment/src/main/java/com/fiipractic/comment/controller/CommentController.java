package com.fiipractic.comment.controller;

import com.fiipractic.comment.requestmodels.CommentRequest;
import com.fiipractic.comment.service.CommentService;
import com.fiipractic.comment.utils.ExtractJWT;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/commentapi/comments")
public class CommentController {
    private CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @CrossOrigin("http://localhost:3000")
    @PostMapping("/")
    public void postComment(@RequestHeader(value = "Authorization") String token, @RequestBody CommentRequest commentRequest) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if (userEmail == null) {
            throw new Exception("Invalid token");
        }
        commentService.postComment(userEmail, commentRequest);
    }

    @GetMapping("/user/pokemon")
    public Boolean reviewBookByUser(@RequestHeader(value = "Authorization") String token,
                                    @RequestParam Integer pokemonId) throws Exception {

        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");

        if (userEmail == null) {
            throw new Exception("Invalid token");
        }

        return commentService.userCommentAlreadyExists(userEmail, pokemonId);
    }

    @GetMapping("/best-rated-pokemon-ids")
    public List<Integer> getBestRatedPokemonIds() {
        return commentService.getBestRatedPokemonIds();
    }

}
