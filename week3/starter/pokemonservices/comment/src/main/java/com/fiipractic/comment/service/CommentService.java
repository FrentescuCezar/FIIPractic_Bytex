package com.fiipractic.comment.service;

import com.fiipractic.comment.model.Comment;
import com.fiipractic.comment.repository.CommentRepository;
import com.fiipractic.comment.requestmodels.CommentRequest;
import com.fiipractic.stablediffusion.repository.StableDiffusionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;

@Service
@Transactional
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public CommentService() {
    }

    public void postComment(String userEmail, CommentRequest commentRequest) throws Exception {
        Comment validateComment = commentRepository.findByUserEmailAndPokemonId(userEmail, commentRequest.getPokemonId());

        if (validateComment != null) {
            throw new Exception("You have already commented on this pokemon");
        }
        Comment comment = new Comment();
        comment.setPokemonId(commentRequest.getPokemonId());
        comment.setRating(commentRequest.getRating());
        comment.setUserEmail(userEmail);

        if(commentRequest.getCommentDescription().isPresent()){
            comment.setCommentDescription(commentRequest.getCommentDescription().map(Object::toString)
                    .orElse(null));
        }

        comment.setDate(Date.valueOf(LocalDate.now()));
        commentRepository.save(comment);
    }

    public Boolean userCommentAlreadyExists(String userEmail, Integer pokemonId){
        Comment validateComment = commentRepository.findByUserEmailAndPokemonId(userEmail, pokemonId);
        if (validateComment != null) {
            return true;
        }
        return false;
    }

}
