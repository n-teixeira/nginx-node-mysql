FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=nginx_node_mysql

COPY init.sql /docker-entrypoint-initdb.d/

CMD ["mysqld", "--default-authentication-plugin=mysql_native_password"]
