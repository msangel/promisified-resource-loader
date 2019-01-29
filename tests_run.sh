#!/bin/bash

dir=$(pwd)

verify () {
if [[ $? -ne 0 ]]; then
    echo -e "\e[31mfail" && exit $?;
fi
}

cd ${dir}

cp index.js test/no_peers/index.js
cd test/no_peers/
npm test
verify

cd ${dir}

cp index.js test/with_sha_peer/index.js
cd test/with_sha_peer/
npm test
verify
