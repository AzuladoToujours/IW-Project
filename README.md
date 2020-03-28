# Requirements

Node, MongoDB, npm.

#Install Dependencies
In the project's directory: 
```
npm install --save
```

# Creating ENV variables

This are the necessary env variables to run the project locally.

1. DEV_DB
2. PORT
3. JWT_SECRET

**DEV_DB** Will be the mongoDB Uri. **Example:** **_mongodb://localhost:27017/IWDev_**
**PORT** Will be the port that the API will listen. **Example:** **_3000_**
**JWT_SECRET** Secret to tokens and encryption **Example:** **_IWPROJECT_**

# Run the project

As we are using nodemon, we'll be using the following command
```
npm run dev
```
