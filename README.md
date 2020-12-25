# Journal

React Native app to store journal, all posts will be encrypted and protected with fingerprint/pin

I found a couple of journal apps, but I don't trust them to store my data.

Since we're encrypting the data using the password based key, we can't separate auth into a separate service
Since we're encrypting the data and want to keep a fast app, we have to remove the forget password feature.

The app works as follows:
User signs up - so we send username/pass to the backend
User data is stored in database with activation set to false
An email is sent to the user to be verified before login
Once verified,
A key for encrypting the entries is generated - we shall call this "entry key"
Another key is derived from the password or username+password, we shall call this "password key"
The entry key is encrypted using the password key to generate an output cipher, we shall call this cipher "encrypted key"
The encrypted key is stored with the user credentials in to the database
The entry key is securely sent and cached in the user's device

When the user logs in,
the username/password is exchanged for refresh token which is cached on the device and in a database(in case it needs to be revoked)
The refresh token is used to exchange for an access token.
If at any time the access token is rejected, the refresh token will exchange itself for a new access token
Every further request should have an access token with it.

The user's encrypted key is downloaded along with the salt
The user's entries are downloaded
We derive the password key using the password and decrypt the encrypted key to get the entry key
The entry key is stored locally and is used to decrypt all the entries

When the user adds a new entry
The data is set to autosave
The data is encrypted using the locally stored entry key and sent with an access token to /entry/:userId

Delete and update entries are similar

This project is divided in to two components:

1. Backend
   Verify user access token
   Store user data in mysql database
   Store user entries in mysql database
   Encrypt entries using user password?
   Signup and store username, password
   Exchange username/password for refresh token
   Exchange refresh token for access token
2. React native app
   User should be able to login
   User should be able to create an account
   User should be able to add entries
   User should be able to view entries as calendar

    Tasks to be completed

[X] Add tests for routes
[] Create sequelize models
[] Test sequelize models
[] Integrate Sequelize models
[] Add other crud routes
[] Create react native app
[] Display entries in app using ock data
[] Create form to add entries
[] Load data from backend api
[] Setup authentication routes
[] Setup registration page
[] Integrate auth
[] Setup encrypted data
