class CommentRequestModel {
    pokemonId: number;
    rating: number;
    commentDescription?: string;

    constructor(pokemonId: number, rating: number, commentDescription?: string) {
        this.pokemonId = pokemonId;
        this.rating = rating;
        this.commentDescription = commentDescription;
    }
}

export default CommentRequestModel;