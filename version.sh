#!/bin/sh

GIT_TAG="$(git describe --tags ${GIT_COMMIT})"

echo "$(git describe --tags ${GIT_COMMIT})"

printenv

cat >./src/assets/json/version.json <<EOF
    {
        "tag": "$GIT_TAG",
        "sha": "$GIT_COMMIT",
        "url": "$GIT_URL"
    }
EOF