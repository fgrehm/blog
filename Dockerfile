FROM node:0.10

RUN curl -Ls https://godist.herokuapp.com/projects/ddollar/forego/releases/current/linux-amd64/forego \
       > /usr/local/bin/forego \
    && chmod +x /usr/local/bin/forego \
    && ln -s /usr/local/bin/forego /usr/local/bin/foreman

# Go hugo!
RUN curl -sL https://github.com/spf13/hugo/releases/download/v0.14/hugo_0.14_linux_amd64.tar.gz \
      | tar vxz -C /tmp \
    && mv /tmp/hugo_*/hugo_* /usr/local/bin/hugo \
    && rm -rf /tmp/*

RUN apt-get update \
    && apt-get install -y sudo \
                          python-pip \
    && apt-get autoremove -yqq \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && pip install Pygments \
    && echo "developer:x:1000:1000:Developer,,,:/home/developer:/bin/bash" >> /etc/passwd \
    && echo "developer:x:1000:" >> /etc/group \
    && mkdir -p /home/developer \
    && chown developer:developer /home/developer \
    && mkdir -p /workspace \
    && chown developer:developer /workspace \
    && echo "developer ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/developer \
    && chmod 0440 /etc/sudoers.d/developer

USER developer

# TODO: Set up node_modules symlink

ENV PATH=/workspace/node_modules/.bin:$PATH
CMD /bin/bash
WORKDIR /workspace
