package com.fiipractic.comment.service;

import com.fiipractic.comment.model.Comment;
import com.fiipractic.comment.repository.CommentRepository;
import com.fiipractic.comment.requestmodels.CommentRequest;
import com.fiipractic.comment.utils.CommentAlreadyExistsException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    private String removeEmailDomain(String userEmail) {

        String userName;
        if (userEmail.contains("@")) {
            userName = userEmail.split("@")[0];
        } else {
            userName = userEmail;
        }

        return userName;
    }

    public List<Integer> getBestRatedPokemonIds() {
        List<Object[]> results = commentRepository.findBestRatedPokemonIds();
        return results.stream()
                .map(result -> (Integer) result[0])
                .collect(Collectors.toList());
    }

    public void postComment(String userEmail, CommentRequest commentRequest) throws CommentAlreadyExistsException {

        if (userCommentAlreadyExists(userEmail, commentRequest.getPokemonId())) {
            throw new CommentAlreadyExistsException("You have already commented on this pokemon");
        }

        Comment comment = new Comment();
        comment.setPokemonId(commentRequest.getPokemonId());
        comment.setRating(commentRequest.getRating());
        comment.setUserName(userEmail);

        comment.setCommentDescription(commentRequest.getCommentDescription().
                map(Object::toString).orElse(null));

        comment.setDate(Date.valueOf(LocalDate.now()));
        commentRepository.save(comment);
    }

    public boolean userCommentAlreadyExists(String userEmail, Integer pokemonId) {
        String userName = removeEmailDomain(userEmail);
        return commentRepository.findByUserNameAndPokemonId(userName, pokemonId) != null;
    }

}
