<p align="center">
  <img src="https://github.com/FrentescuCezar/FIIPractic_Bytex/blob/main/Poketex/03-frontend/poketex/src/Images/PublicImages/Pokytex-2.png" width=500 title="Poketex">
</p>

# Poketex

Poketex is an AI-powered art generation project that allows users to create, explore, and interact with their own and others' AI-generated Pokemon. \
This project was developed during a training organized by the company Bytex, called "Java in the world of microservices". 


## Features


### Non-logged in users
- **Home page:** Displays the most voted Pokemons.
- **Search page:** Offers pagination and allows searching for pokemons by name, prompt, and user. The default is the most recent pokemons.
- **Pokemon page:** Showcases the picture, stats, description (story), comments, rating, and related Pokemons.
- **PokeMystery page:** Presents a random Pokemon for users to guess its name or prompt.

### Logged-in users
- All features available to non-logged in users.
- **Create Pokemon:** Generate custom Pokemon with auto-generated image, using Stable Diffusion Automatic1111 REST API, and stats, names, and descriptions using ChatGPT API.
- **Breed Pokemons:** Combine attributes of different Pokemons to create unique offspring.
- **Comment and rate:** Provide feedback on other users' Pokemon creations.
- **Dynamic profile picture:** On each refresh, the user's profile picture transforms into one of their created Pokemons.

| Homepage                                                                                              | Design your Pokemon                                                                                             | Breed with other pokemons                                                                                                     |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| ![](https://github.com/FrentescuCezar/FIIPractic_Bytex/blob/main/Poketex/Screenshots/Homepage.png) | ![](https://github.com/FrentescuCezar/FIIPractic_Bytex/blob/main/Poketex/Screenshots/Design-Your-Pokemon.png) | ![](https://github.com/FrentescuCezar/FIIPractic_Bytex/blob/main/Poketex/Screenshots/Breeding.png) |


| Pokemon Page                                                                                              | Comments                                                                                            | PokeMystery                                                                                                     |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| <img src="https://github.com/FrentescuCezar/FIIPractic_Bytex/blob/main/Poketex/Screenshots/Pokemon-Page.png" width="700" height="300"> | <img src="https://github.com/FrentescuCezar/FIIPractic_Bytex/blob/main/Poketex/Screenshots/Comments.png"> | <img src="https://github.com/FrentescuCezar/FIIPractic_Bytex/blob/main/Poketex/Screenshots/PokeMystery.png"> |




## AI Model & Technologies

**Frontend** \
_React_ [React official website](https://react.dev/)<br />
_TypeScript_ [TypeScript official website](https://www.typescriptlang.org/)<br />
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png" width="70"/>

 **Backend** \
_API_ [Java Spring](https://spring.io/)<br />
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Spring_Framework_Logo_2018.svg/1280px-Spring_Framework_Logo_2018.svg.png" width = "200"> <br />

**Database** <br />
_PostgreSQL_ [PostgreSQL official website](https://www.postgresql.org/ ) <br />
<img src="https://www.turnkeylinux.org/files/images/postgresql-logo-for-blog.png" width="200"/> <br/>

**Stable Diffusion** <br />
- Art generation is powered by the model trained by Justin Pinkney, with Lambda Diffuser and Stable Diffusion: https://huggingface.co/justinpinkney/pokemon-stable-diffusion.
- Stable Diffusion module utilizes the Automatic1111 nowebui Rest API: https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API

**ChatGpt** <br />
- The Name and the Description of the pokemon is automatically generated with ChatGPT-3.5TURBO model : https://github.com/PlexPt/chatgpt-java

**Security** <br />
- Authentication and user management is handled by Okta with OAuth2 security. https://developer.okta.com/


## Acknowledgements

- Bytex for organizing the "Java in the world of microservices" training (Trainers : Alexandru Cretu, Cristian Danila)
- Justin Pinkney for the art generation model.
- Automatic1111 for the Stable Diffusion API
- PlexPt for the ChatGPT connexions
- Okta for providing user authentication and management.
