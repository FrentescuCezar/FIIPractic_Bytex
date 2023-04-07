import CommentModel from "../../../models/CommentModel";
import PoketexModel from "../../../models/PoketexModel";

export async function fetchPoketex(poketexId: string): Promise<PoketexModel> {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const baseUrl: string = `http://localhost:8084/api/poketexes/${poketexId}`;
  const response = await fetch(baseUrl, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Something went wrong!');
  }

  const data = await response.json();

  const loadedPoketex = new PoketexModel(
    data.id,
    data.name,
    data.username,
    data.description,
    data.image,
    data.seed,
    data.prompt,
    data.steps,
    data.generation,
    data.abilities,
    data.type1,
    data.type2,
    data.hp,
    data.attack,
    data.spAttack,
    data.defense,
    data.spDefense,
    data.speed,
    data.baseTotal,
    data.baseEggSteps,
    data.experienceGrowth,
    data.parent1,
    data.parent2
  );

  return loadedPoketex;
}


export async function fetchParent(parentId: number): Promise<any> {
  const response = await fetch(`http://localhost:8084/api/poketexes/${parentId}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Something went wrong!');
  }

  const data = await response.json();
  return data;
}

export async function fetchComments(poketexId: string): Promise<CommentModel[]> {
  const commentUrl: string = 'http://localhost:8086/commentapi/comments/search/findByPokemonId?pokemonId=' + poketexId;

  const responseComment = await fetch(commentUrl);

  if (!responseComment.ok) {
    throw new Error('The comments are not showing!');
  }

  const responseJsonComments = await responseComment.json();
  const responseData = responseJsonComments._embedded.comments;

  const loadedComments: CommentModel[] = responseData.map((comment: any) => {
    return new CommentModel(
      comment.id,
      comment.userName,
      new Date(comment.date),
      comment.rating,
      comment.pokemonId,
      comment.commentDescription
    );
  });

  return loadedComments;
}

//
export async function fetchUserCommentPokemon(authState: any, poketexId: string): Promise<boolean> {
  if (authState && authState.isAuthenticated) {
    const url = `http://localhost:8086/commentapi/comments/user/pokemon?pokemonId=${poketexId}`;
    const requestOptons = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
        'Content-Type': 'application/json',
      }
    };
    const userComment = await fetch(url, requestOptons);
    if (!userComment.ok) {
      throw new Error('Something went wrong!');
    }
    const userCommentResponseJson = await userComment.json();
    return userCommentResponseJson
  }
  return false;
}

export async function fetchRelatedPokemons(currentPage: number, poketexesPerPage: number, poketex: PoketexModel | undefined): Promise<{ relatedPoketexes: PoketexModel[], totalAmountOfRelatedPoketexes: number, totalPages: number }> {
  // Move fetchRelatedPokemons code here
  const searchNameAndPrompt = poketex?.name + ' ' + poketex?.prompt;
  const searchWords = searchNameAndPrompt?.trim().split(/\s+/) ?? [];
  const stopWords = ['a', 'the', 'an', 'and', 'or', 'in', 'on', 'at', 'with', 'by', 'made', 'without'];
  const filteredPrompt = searchWords.filter(word => !stopWords.includes(word.toLowerCase()));

  let baseUrl: string = `http://localhost:8084/api/poketex/related?prompt=${filteredPrompt}`;
  const url: string = `${baseUrl}&page=${currentPage - 1}&size=${poketexesPerPage}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('The Servers are down. Please try again later.');
  }
  const responseJson = await response.json();

  let responseData;
  responseData = responseJson.content;

  const relatedPoketexes: PoketexModel[] = [];
  for (const key in responseData) {
    const data = responseData[key];
    const id: number = data.id;

    if (id === poketex?.id) {
      continue;
    }

    const poketexRelated = new PoketexModel(
      id, data.name, data.username,
      data.description, data.image, data.seed,
      data.prompt, data.steps, data.generation,
      data.abilities, data.type1, data.type2,
      data.hp, data.attack, data.spAttack,
      data.defense, data.spDefense, data.speed,
      data.baseTotal, data.baseEggSteps, data.experienceGrowth, data.parent1, data.parent2,
    );
    relatedPoketexes.push(poketexRelated);
  }

  const totalAmountOfRelatedPoketexes = responseJson.totalElements - 1;
  const totalPages = responseJson.totalPages;

  return { relatedPoketexes, totalAmountOfRelatedPoketexes, totalPages };
}