class Comment {
    public id: number;
    public userName: string;
    public date: Date;
    public rating: number;
    public pokemonId: number;
    public commentDescription: string;

    constructor(
        id: number,
        userName: string,
        date: Date,
        rating: number,
        pokemonId: number,
        commentDescription: string
    ) {
        this.id = id;
        this.userName = userName;
        this.date = date;
        this.rating = rating;
        this.pokemonId = pokemonId;
        this.commentDescription = commentDescription;
    }
}

export default Comment;