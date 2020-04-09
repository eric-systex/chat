# Use an official Python runtime as an image
FROM a502dh.systex.com/library/python:3.7-alpine

RUN apk update && \
    apk add tzdata && \
    ln -sf /usr/share/zoneinfo/${TZ} /etc/localtime && \
    echo "${TZ}" > /etc/timezone
RUN apk add --no-cache --virtual .pynacl_deps build-base gcc libc-dev mariadb-dev python3-dev libffi-dev 

# The EXPOSE instruction indicates the ports on which a container # # will listen for connections
# Since Flask apps listen to port 5000  by default, we expose it
EXPOSE 5000

# Sets the working directory for following COPY and CMD instructions
# Notice we haven’t created a directory by this name - this
# instruction creates a directory with this name if it doesn’t exist
WORKDIR /app

# Install any needed packages specified in requirements.txt
COPY build/requirements.txt /tmp
RUN pip install jwt
RUN pip install -r /tmp/requirements.txt

# Run run.py when the container launches
ADD build/chat.tar /app
CMD python run.py

