## Docker環境建置

##### Docker build 步驟

first, enter python virtual env. (if need)
source ~/virtualenv/chat/bin/activate

1. cd ../../src/angular/ && ./build.sh && cd ../../env/docker
2. pip freeze > build/requirements.txt 
3. cd ../../src && tar -cvf ../env/docker/build/chat.tar --exclude=__pycache__ --exclude=angular --exclude=chat.lo* --exclude=.* * && cd ../env/docker 
4. docker build -t a502dh.systex.com/systex.chat/chat:1 .
5. docker push a502dh.systex.com/systex.chat/chat:1


##### Docker-Compose 步驟

1. docker-compose down
2. modify docker image version in docker-compose.yml
3. docker-compose up -d
4. docker-compose scale web=2


