DROP TABLE IF EXISTS `users_roles`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `roles`;

CREATE TABLE IF NOT EXISTS users
(
    id         bigint  not null auto_increment,
    age        integer not null,
    email      varchar(255),
    first_name varchar(255),
    last_name  varchar(255),
    password   varchar(255),
    primary key (id)
) engine = InnoDB;

CREATE TABLE IF NOT EXISTS roles
(
    id   bigint not null,
    name varchar(255),
    primary key (id)
) engine = InnoDB;

CREATE TABLE IF NOT EXISTS users_roles
(
    user_id bigint not null,
    role_id bigint not null,
    foreign key (user_id) references users (id),
    foreign key (role_id) references roles (id)
) engine = InnoDB;