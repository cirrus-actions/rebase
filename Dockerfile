FROM alpine:latest

LABEL version="1.0.0"
LABEL repository="http://github.com/cirrus-actions/rebase"
LABEL homepage="http://github.com/cirrus-actions/rebase"
LABEL maintainer="Cirrus Labs"
LABEL "com.github.actions.name"="Automatic Rebase"
LABEL "com.github.actions.description"="Automatically rebases PR on '/rebase' comment"
LABEL "com.github.actions.icon"="git-pull-request"
LABEL "com.github.actions.color"="purple"

RUN apk --no-cache add jq bash curl git git-lfs
RUN apk add --update nodejs npm

ADD resolve-changelog /resolve-changelog
ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
