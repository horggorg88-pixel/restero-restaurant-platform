FROM nginx:latest

ARG UID1
ARG GID1
ARG USERNAME
ARG GNAME

RUN addgroup --gid $GID1 $GNAME \
    && adduser --uid $UID1 --ingroup $GNAME --shell /bin/bash --disabled-password $USERNAME
