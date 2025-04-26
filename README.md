# AI.Newsletter.Generator.and.Publisher

This Rocket.Chat app leverages modern open source LLMs (Mistral, Llama2, Phi, and so on) to help generate newsletters for special interest groups and/or teams operating on a Rocket.Chat server. The newsletter author should be able to supply raw content to the AI generator and have perfectly phrased and formatted newsletter generated. The app should allow for the immediate or scheduled publication of the resulting newsletter to either a team, subset of the server's user, or all of the server's users. The app should also allow for emailing those who prefers to receive the newsletter via email. Ideally the app should maintain a list of dynamically changing newsletter subscribers.

from [GSoC](https://summerofcode.withgoogle.com/programs/2024/projects/2H2oqjBC)

[Final report](https://gist.github.com/yurikomium/4907045a803e739ec488a20bcb53f11f)

# Getting Started

### Prerequisites

-   You need a Rocket.Chat Server Setup
-   Rocket.Chat.Apps CLI,

*   In case you don't have run:
    ```sh
    npm install -g @rocket.chat/apps-cli
    ```

### Installation

-   Every RocketChat Apps runs on RocketChat Server, thus everytime you wanna test you need to deploy the app with this note. lets start setting up:

1. Clone the repo
    ```sh
    git clone https://github.com/RocketChat/Apps.AI.Newsletter.Generator.and.Publisher.git
    ```
2. Navigate to the project directory
    ```sh
    cd Apps.AI.Newsletter.Generator.and.Publisher
    ```    
3. Install NPM packages
    ```sh
    npm install
    ```
4. Deploy app using:

    ```sh
    rc-apps deploy --url <server_url> --username <username> --password <password>
    ```
      Where:
    - `<server_url>` is the URL of your Rocket.Chat workspace.
    - `<username>` is your username.
    - `<password>` is your password.

## Usage 

The app provide slash commands that you can use to interact with it.

-   **`/newsletter generate [user's input]`**: Generate a newsletter
-   **`/newsletter help`**: Get a list of commands related to the newsletter app

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue.
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feat/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: adds some amazing feature'`)
4. Push to the Branch (`git push origin feat/AmazingFeature`)
5. Open a Pull Request

## Prompt engineering

You can see the progress of the prompt engineering in [Wiki](https://github.com/RocketChat/Apps.AI.Newsletter.Generator.and.Publisher/wiki).
