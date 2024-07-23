FROM registry.access.redhat.com/ubi8/ubi

LABEL name="VHS Rental System" maintainer="Ivan Skorupan <ivan.skorupan@true-north.hr>"

ENV NODEJS_VERSION=20

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN yum -y module enable nodejs:$NODEJS_VERSION && \
    INSTALL_PKGS="nodejs npm" && \
    yum install -y --setopt=tsflags=nodocs $INSTALL_PKGS && \
    rpm -V $INSTALL_PKGS && \
    yum -y clean all --enablerepo='*'

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
