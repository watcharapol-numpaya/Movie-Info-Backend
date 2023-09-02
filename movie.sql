DROP TABLE IF EXISTS users;

-- Create the users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    favorite_movie INTEGER[], -- This column will store an array of movie IDs
	refresh_token VARCHAR(255)
);
 
-- Inserting sample data for users
INSERT INTO users (username, password, favorite_movie, refresh_token)
VALUES
    ('user1', 'hashed_password_1', ARRAY[1, 3, 5], 'refresh_token_1'),
    ('user2', 'hashed_password_2', ARRAY[2, 4], 'refresh_token_2'),
    ('user3', 'hashed_password_3', ARRAY[1, 2, 3, 4], 'refresh_token_3'),
    ('user4', 'hashed_password_4', ARRAY[5], 'refresh_token_4');
	
-- You can continue to add more rows as needed
SELECT * FROM users;
 
 
