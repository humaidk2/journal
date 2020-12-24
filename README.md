# Journal

React Native app to store journal, all posts will be encrypted and protected with fingerprint/pin

I found a couple of journal apps, but I don't trust them to store my data.

This project is divided in to three components:

1. Backend
   Verify user access token
   Store user data in mysql database
   Store user entries in mysql database
   Encrypt entries using user password?
2. React native app
   User should be able to login
   User should be able to create an account
   User should be able to add entries
   User should be able to view entries as calendar
3. Auth service
   Signup and store username, password
   Exchange username/password for refresh token
   Exchange refresh token for access token
