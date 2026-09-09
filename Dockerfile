# FIXME: Not tested

FROM node:22-bookworm AS builder
WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
RUN npm run build

# Remove bundles used during the build process
RUN rm -r /app/nodecg/bundles

FROM node:22-bookworm
WORKDIR /app

# Create symlinks for all mounted NodeCG folders
RUN ( \
    ln -s /mnt/assets assets && \
    ln -s /mnt/bundles bundles && \
    ln -s /mnt/cfg cfg && \
    ln -s /mnt/db db && \
    ln -s /mnt/logs logs \
)

# Transfer compiled NodeCG resources from build image
COPY --from=builder /app/nodecg/ /app/

ENTRYPOINT ["npm", "run", "start"]
