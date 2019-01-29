#!/bin/bash

dir=$(pwd)

verify () {
if [[ $? -ne 0 ]]; then
    echo -e "\e[31mfail" && exit $?;
fi
}

cd ${dir}

node > test/no_peers/package.json <<EOF
//Read data
var data = require('./package.json');

//Manipulate data
delete data.scripts.postinstall
delete data.scripts.test
data.scripts.test = 'nyc mocha --timeout 2000';

//Output data
console.log(JSON.stringify(data, null, 2));

EOF

cp index.js test/no_peers/index.js
cd test/no_peers/
rm -rf node_modules
npm install
verify

cd ${dir}

cp package.json test/with_sha_peer/package.json
node > test/with_sha_peer/package.json <<EOF
//Read data
var data = require('./package.json');

//Manipulate data
delete data.scripts.postinstall
delete data.scripts.test
data.scripts.test = 'nyc mocha --timeout 2000';


//Output data
console.log(JSON.stringify(data, null, 2));

EOF
cp index.js test/with_sha_peer/index.js
cd test/with_sha_peer/
rm -rf node_modules
npm install
npm install json-hash
verify

