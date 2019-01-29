#!/bin/bash

dir=$(pwd)

verify () {
if [[ $? -ne 0 ]]; then
    echo -e "\e[31mfail" && exit $?;
fi
}

cd ${dir}

cd cd test/no_peers/
npm test
verify

cd ${dir}
cd test/with_sha_peer/
npm test
verify
