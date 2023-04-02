class Comment {
    public id: number;
    public userEmail: string;
    public date: Date;
    public rating: number;
    public pokemonId: number;
    public reviewDescription: string;
  
    constructor(
      id: number,
      userEmail: string,
      date: Date,
      rating: number,
      pokemonId: number,
      reviewDescription: string
    ) {
      this.id = id;
      this.userEmail = userEmail;
      this.date = date;
      this.rating = rating;
      this.pokemonId = pokemonId;
      this.reviewDescription = reviewDescription;
    }
  }

  export default Comment;