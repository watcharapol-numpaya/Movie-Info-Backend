DROP TABLE IF EXISTS users;

CREATE TABLE users (
    userId SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    favorite_movie INTEGER[] -- This column will store an array of movieIds
);

-- Inserting sample data for users
INSERT INTO users (username, password, favorite_movie)
VALUES
    ('user1', 'hashed_password_1', ARRAY[1, 3, 5]),
    ('user2', 'hashed_password_2', ARRAY[2, 4]),
    ('user3', 'hashed_password_3', ARRAY[1, 2, 3, 4]),
    ('user4', 'hashed_password_4', ARRAY[5]);

-- You can continue to add more rows as needed
SELECT * FROM users;
