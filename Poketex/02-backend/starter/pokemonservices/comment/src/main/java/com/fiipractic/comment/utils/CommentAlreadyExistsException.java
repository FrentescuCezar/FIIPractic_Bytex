package com.fiipractic.comment.utils;

public class CommentAlreadyExistsException extends Exception {
    public CommentAlreadyExistsException(String message) {
        super(message);
    }
}