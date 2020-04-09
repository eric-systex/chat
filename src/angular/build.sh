#! /bin/sh

ng build --prod --base-href /chat/static/
rm -v ../app/static/*
cp -v dist/angular/* ../app/static/
mv -v ../app/static/index.html ../app/templates/index.html

