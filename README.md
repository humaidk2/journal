# Journal

## Description

React Native app to store journal, all posts will be encrypted and protected with fingerprint/pin

I found a couple of journal apps, but I don't trust them to store my data.

So I built my own

## How it will work

The app works as follows:

-   User signs up - so we send username/pass to the backend
-   The password is hashed
-   User data is stored in database with activation set to false
-   An email is sent to the user to be verified before login
-   Once verified,
-   A key for encrypting the entries is generated - we shall call this "entry key"
-   Another key is derived from the password or username+password, we shall call this "password key"
-   The entry key is encrypted using the password key to generate an output cipher, we shall call this cipher "encrypted key"
-   The encrypted key is stored with the user credentials in to the database
-   The entry key is securely sent and cached in the user's device

When the user logs in,

-   the username/password is exchanged for refresh token which is cached on the device and in a database(in case it needs to be revoked)
-   The refresh token is used to exchange for an access token.
-   If at any time the access token is rejected, the refresh token will exchange itself for a new access token
-   Every further request should have an access token with it.

-   If there is a key
    -   The user's encrypted key is downloaded along with the salt
    -   The user's entries are downloaded
    -   We derive the password key using the password and decrypt the encrypted key to get the entry key
    -   The entry key is stored locally and is used to decrypt all the entries
-   If there is no key
    -   we generate the entry key
    -   we derive the password key from the password
    -   we encrypt the entry key using the password key to get the encrypted key
    -   we store the entry key locally
    -   we send the encrypted key to the database

When the user adds a new entry

-   The data is set to autosave
-   The data is encrypted using the locally stored entry key and sent with an access token to /entry/:userId

Delete and update entries are similar

## Componenets

This project is divided in to three components:

1. Backend
    - Verify user access token
    - Store user data in mysql database
    - Store user entries in mysql database
    - Encrypt entries using user password?
2. React native app

    - User should be able to login
    - User should be able to create an account
    - User should be able to add entries
    - User should be able to view entries as calendar

3. Auth service
    - Signup and store username, password
    - Exchange username/password for refresh token
    - Exchange refresh token for access token

### Tasks to be completed

- [X] Add tests for routes
- [X] Create sequelize models
- [X] Test sequelize models
- [X] Integrate Sequelize models
- [X] Separate Auth and api service
- [X] Get docker to work
- [X] Add testing with docker
- [X] Complete and test auth service
- [X] Add middleware for diary entry service
- [X] Complete and test diary entry service
- [X] Create react native app
- [X] Display entries in app using mock data
- [X] Create form to add entries
- [X] Load data from backend api
- [X] Add other crud routes
- [X] Setup registration page
- [X] Integrate auth
- [X] Setup encrypted data
- [X] Setup autologin using refresh token
- [] Styling the design of entries page
- [] Edit page with requests every few seconds or when user finished typing
- [] Calendar View to show when the user made entries

-   Finish integrating sequelize with routes
-   Add mysql to docker
-   Separate auth service
-   Fix routes now that auth is separate, we get all user data from token!
-   Test api routes using tokens

            /--------- Auth Service - signup/verifyEmail/login/refresh/updateUserInfo(delete access token, store Key)
           /
          /
         /

    User ------------- Entry Api - Postentry/GetEntry/GetallEntries/DeleteEntry/(get user id from access token)
    \
     \
     \
     \---------- React Native app - login page/register/ diary entries page/addentrypage==editentrypage
