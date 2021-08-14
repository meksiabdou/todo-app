# @meksiabdou/todo-app

Todo Application Web

- Frontend développé par Reactjs  (support PWA)
- Backend développé par Nodejs & MySqli

## Installation

### Configuration de l'environnement 

### 1. Windows

#### 1.1 Installer Nodejs & MysQli & Git

Nous vous recommandons d'installer Nodejs & Mysqli & Git par [Download Laragon](https://laragon.org/docs/install.html)

### 2. MacOs

#### 2.1 Installer Homebrew

```bash
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2.2 Installer Git

```bash
$ brew install git
```

#### 2.3 Installer Nodejs

```bash
$ brew install node
```

#### 2.4 Installer MySqli

Nous vous recommandons d'installer Mysqli par [Download Xampp](https://www.apachefriends.org/download.html)

### 3. Linux

#### 3.1 Installer Git

Suivez les instructions d'installation de votre distribution Linux pour installer [Git](https://git-scm.com/download/linux).
#### 3.2 Installer Nodejs

Suivez les instructions d'installation de votre distribution Linux pour installer [Nodejs](https://nodejs.org/en/download/package-manager/).
#### 3.3 Installer MySqli

Nous vous recommandons d'installer Mysqli par [Download Xampp](https://www.apachefriends.org/download.html)

## Usage

```bash
$ git Clone https://github.com/meksiabdou/todo-app && cd ./todo-app
```

### Todo API

```bash
$ cd ./todo-api
```
### Modifier les paramètres de l'environnement (.env)

| Name | Type | Example Value |
|:------:|:------:|:---------------:|
| DB_NAME | String | todo-app |
| DB_USERNAME | String | root |
| DB_PASSWORD | String | todo-password |
| DB_HOST | String | localhost |
| DB_PORT | Integer | 3306 |
| HOSTNAME | String | localhost |
| PORT | Integer | 3090 |
| LOGIN_FIELD | String | email |
| JWT_SECRET | String | $uk2gldg2z2MlN2LnzkxQBfv9uVQ7NQTu |
| APP_TOKEN | String | AxlGuQ7nQ2k2Y0N2uvOfvzVMQ7nBNQTQuuVMlG |
| NODE_ENV | String | production |
| ERROR_LOG | Integer (0 or 1) | 1 |

### Import sql file 
[Youtube Tutorial](https://www.youtube.com/watch?v=rt3Ru9-LHnY)
### Exécution Todo Api

```bash
$ npm install -g nodemon
```

```bash
$ npm install
```

```bash
$ npm run dev
```

### Todo App Reactjs

```bash
$ cd ./todo-app-reactjs-pwa
```
### Modifier les paramètres de l'environnement (.env)

| Name | Type | Example Value |
|:------:|:------:|:---------------:|
| REACT_APP_DOMAIN_API | String | http://localhost:3090 |
| REACT_APP_TOKEN_NAME | String | token |
| REACT_APP_TOKEN | String | AxlGuQ7nQ2k2Y0N2uvOfvzVMQ7nBNQTQuuVMlG |

### Exécution Todo Api

```bash
$ npm install
```

```bash
$ npm start
```
