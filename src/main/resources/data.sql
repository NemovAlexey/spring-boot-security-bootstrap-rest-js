INSERT INTO users (id, age, email, first_name, last_name, password)
VALUES
(1, 32, 'admin@mail.ru', 'admin', 'admin', '$2a$12$jDe2zrLGneUfjsbsat5zI.ZMDqVPoHje1R/.u3MqcC/T9Zrs1Bn4K'),
(2, 31, 'user@mail.ru', 'user', 'user', '$2a$12$yapeOKJ4g7JTqnKZCOO5k.1gmaR7MmZ6tzvZUZxXfvlQSAzI72apC');

INSERT INTO roles (id, name)
VALUES
(1, 'ROLE_ADMIN');

INSERT INTO roles (id, name)
VALUES
(2, 'ROLE_USER');

INSERT INTO users_roles (user_id, role_id)
VALUES
(1, 1),
(1, 2),
(2, 2);