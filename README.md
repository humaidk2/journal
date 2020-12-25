# Journal

React Native app to store journal, all posts will be encrypted and protected with fingerprint/pin

I found a couple of journal apps, but I don't trust them to store my data.

Since we're encrypting the data using the password based key, we can't separate auth into a separate service
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

[] Add tests for routes
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
