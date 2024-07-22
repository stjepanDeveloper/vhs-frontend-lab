FROM registry.access.redhat.com/ubi8/ubi

LABEL name="VHS Rental System" maintainer="Ivan Skorupan <ivan.skorupan@fer.hr>"

ENV NODEJS_VERSION=22
ENV DATABASE_URL=postgres://postgres:postgres@vhs-database/vhs-database

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yum -y module enable nodejs:$NODEJS_VERSION && \
    INSTALL_PKGS="nodejs npm" && \
    yum install -y --setopt=tsflags=nodocs $INSTALL_PKGS && \
    rpm -V $INSTALL_PKGS && \
    yum -y clean all --enablerepo='*' && \
    npm i -g yarn

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["node", "dist/main"]
