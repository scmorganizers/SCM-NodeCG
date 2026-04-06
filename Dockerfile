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

# Install NodeCG (not compatible with alpine)
COPY nodecg/package.json .
COPY nodecg/package-lock.json .
RUN npm install

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
