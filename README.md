# book-shelf-project
This repository contains a book-shelf project using MERN stack. 
**Features**

1. Search books from Google Books API
2. Add Searched books to the shelf
3. Add Ratings, reviews to the book
4. Add Progress
5. User Profile
6. MongoDB Atlas to store the data
7. User Authentication using JWT


>[Working Demo ](https://book-shelf-4.onrender.com)
(Deployed on render)

Please follow the instrunctions to set it up.

This Repo consists of two folders backend and frontend
1. Clone the repo and run ``npm install`` in both folders
2. In the backend folder's server.js file, uncomment all the occurence of cors.
3. make a .env file in both frontend and backend folder
4. In frontend's env file add the lines: ```REACT_APP_BACKEND_URL_DEVELOPMENT="http://localhost:3001"
REACT_APP_BACKEND_URL_PRODUCTION=<Where you will deploy the project>```
5. In backend's env file add: ```MONGODB_KEY=<MONGODB_KEY that you get from Atlas>
SECRET_KEY=<secret key from JWT>```
6. run ``npm start`` in both frontend and backend folder.
7. With these settings, project should be ready to use.


