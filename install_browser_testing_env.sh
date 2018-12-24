#!/bin/bash

rm -rf test/vendor
mkdir -p test/vendor

./node_modules/.bin/node ./node_modules/.bin/browserify ./node_modules/chai/lib/chai.js --standalone chai -o ./test/vendor/chai.js
if [[ $? -ne 0 ]]; then
    echo -e "\e[31mbrowserify fail" && exit $?;
fi

./node_modules/.bin/node ./node_modules/.bin/browserify ./node_modules/chai-as-promised/lib/chai-as-promised.js --standalone chai-as-promised -o ./test/vendor/chai-as-promised.js
if [[ $? -ne 0 ]]; then
    echo -e "\e[31mbrowserify fail" && exit $?;
fi

./node_modules/.bin/node ./node_modules/.bin/browserify ./node_modules/promise-timeout/index.js --standalone promise-timeout -o ./test/vendor/promise-timeout.js
if [[ $? -ne 0 ]]; then
    echo -e "\e[31mbrowserify fail" && exit $?;
fi




cp ./node_modules/mocha/mocha.js           ./test/vendor/mocha.js
cp ./node_modules/mocha/mocha.css          ./test/vendor/mocha.css
cp ./node_modules/chai-spies/chai-spies.js ./test/vendor/chai-spies.js

echo -e "files created test/vendor/{mocha.js, mocha.css, chai.js, chai-as-promised.js, chai-spies.js, promise-timeout.js} \e[93mOK"
