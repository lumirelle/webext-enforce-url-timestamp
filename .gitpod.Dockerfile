FROM gitpod/workspace-full-vnc

USER root

# Install the mise toolchain manager and Firefox (the `web-ext` run target)
RUN curl -fsSL https://mise.run | MISE_INSTALL_PATH=/usr/local/bin/mise sh \
    && apt-get update \
    && apt-get install -y firefox

USER gitpod
