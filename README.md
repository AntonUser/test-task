### Install dependencies
``` bash
yarn
```
### Prepare configuration
``` bash
cp .env.example .env
```
### Run dependency containers
``` bash
docker-compose up -d
```
### Run app in developer mode
```bash
yarn start:dev
```
### Send query in 
```
http://localhost:3000/
```