[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/hxTav0v1)
Login with your Northeastern credentials and read the Project Specifications [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/EcUflH7GXMBEjXGjx-qRQMkB7cfHNaHk9LYqeHRm7tgrKg?e=oZEef3).

Add design docs in _images/_

## Instructions to setup and run project


## How to run

run client:

```
cd ./client
npm install
npm run start
```

run server

```
cd ./server
npm install
node init.js
node server.js
```

run tests

```
cd ./testing
npm install
npx cypress open
```

## Docker containerization

You have been provided with Dockerfiles in the client/ and server/ directories.
A docker-compose.yml is also provided for creating client, server and mongo images.

The following is a sample directory structure,

```bash
.
├── README.md
├── client
│   ├── Dockerfile
│   ├── package-lock.json
│   └── package.json
├── docker-compose.yml
├── img.png
├── img_1.png
└── server
    ├── Dockerfile
    ├── auth.js
    ├── config.js
    ├── controller
    │   ├── answer.js
    │   ├── comment.js
    │   ├── question.js
    │   ├── tag.js
    │   └── user.js
    ├── destroy.js
    ├── init.js
    ├── model
    │   ├── answer.js
    │   ├── comment.js
    │   ├── question.js
    │   ├── schema
    │   │   ├── answer.js
    │   │   ├── comment.js
    │   │   ├── question.js
    │   │   ├── tag.js
    │   │   └── user.js
    │   ├── tag.js
    │   └── user.js
    ├── package-lock.json
    ├── package.json
    └── server.js

```
1. You should notice that there would be separate client and server directories 
under the main project directory.
2. Also note each of the client and server have their own Dockerfiles provided
3. The docker-compose.yml is in the project root
4. .dockerignore hidden files are also present in the server and client directories to ignore adding node_modules to the docker images

In order to set up the project in docker, follow the below steps.
1. Install docker by referring - https://docs.docker.com/engine/install/
2. Ensure you have docker set-up on your host machines and the docker daemon is up and running.
3. Update the Mongodb url as per the docker-compose.yml, i.e. update mongodb://localhost:27017/fake_so to mongodb://mongodb:27017/fake_so 
4. From the main project directory, run the command to generate the images and start the containers
```
docker-compose up
```
This should result in the container being up and running.