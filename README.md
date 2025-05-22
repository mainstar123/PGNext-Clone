# Introduction - DiamondKast Player - NextJS

This projects is deployed to production in an iframe into www.perfectgame.org player profile page and game page. It is not intended to be a stand alone player.

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Installation process and Software dependencies

1. Install the Node JS(>=16.0.0) latest version.
2. Preferred IDE for development VS code.
3. Checkout the code from azure devops `dev` branch.

### Configuring and starting the application

1. In command prompt navigate to the folder with package.json.
2. Install the dependant node modules by running the command `npm install`
3. Then, run the development server: npm run dev
4. When running locally, an env.local file is necessary with the proper variables. See the .env for examples.

Navigate to the URL `http://localhost:3000` to open the running dev project.

## Contribute

### Branches

- dev is the primary branch
- main is the production branch

Code changes to dev or main require a PR. Branches should follow the features/my-new-thing or fixes/my-bug-fix naming convention.

## Deploy on Azure web app

The Next JS application Deployment to azure web app is automatically taken care by the CI/CD build and release pipelines.
The published dev web app can be accessed from [here](https://dkplus-dev.azurewebsites.net)

Production deployment in Azure DevOps is handled through deployment slots. Code changes from 'main' are pushed to the staging slot.

Environnement variables are handled in Azure DevOps using the Secure File from the library based on dev or prod since there is not a stage site.

## Environment Setup For Local Testing

The NextJS app calls a modal on the parent window. Since this application runs in an iFrame, the modal if someone is not logged in is on the www.perfectgame.org website. This variable is controlled through an variable and can be configured for dev testing by setting the proper URL in the .env.local, such as: NEXT_PUBLIC_PARENT_IFRAME="https://localhost:44383/"

The .env.local file should not be committed into the repo.

Additionally, the .env.local file needs a API key for the game viewer. This is used for the Drund API and is the subscription key for the Azure API Gateway. This value is passed as a header through the headers as "Ocp-Apim-Subscription-Key".

This value has been saved in the Azure Key Vault under: DkViewerNextJsAzureAPISubscriptionKeyForTPA

The value for SupaBase API (NEXT_PUBLIC_SUPABASE_ANON_KEY) is saved in the Key Vault under: DkViewerNextJsSupaBaseAnonKey

## DK Player vs WWW vs Authenticated PG End User
The DK player is iFramed in the WWW site and runs off a sub domain. The original implementation works as follows:
1. DK Player as a hard coded username and password in client source, unprotected.
2. WWW site optionally passes via GET, a strangely encoded User Id or Account Id to DK Player.
3. TPA has and endpoint and shares the same strange encoded method for decrypting the User Id or Account Id
4. If the DK player is loaded with the User Id in the query string, this is passed to TPA endpoint for verification. Authentication and authorization to TPA endpoint is handled through the unsecured credentials from DK Player.
5. If the User Id is valid, meaning it is a valid account id in the database, DK Player assumes the identity of the User for subscription validation (in other words, if the user is logged in or not).

This workflow has numerous security issues and should be rebuilt properly. Tracked under [BUG #2847](https://dev.azure.com/pg-ba/PGNext/_workitems/edit/2847)
