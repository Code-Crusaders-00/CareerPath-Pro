INSERT INTO users (username, password, firstName, lastNAME, email) VALUES
('user1', 'pass1', 'user', '1', 'user1@gmail.com'),
('user2', 'pass2', 'user', '2', 'user2@gmail.com'),
('user3', 'pass3', 'user', '3', 'user3@gmail.com'),
('user4', 'pass4', 'user', '4', 'user4@gmail.com'),
('user5', 'pass5', 'user', '5', 'user5@gmail.com');

INSERT INTO applications (jobID, name, company, industry, description) VALUES
(1, 'Software Intern 1', 'Google', 'Tech', 'This be a cool job'),
(2, 'Software Intern 2', 'Meta', 'Tech', 'This be a cool job'),
(3, 'Software Intern 3', 'Apple', 'Tech', 'This be a cool job'),
(4, 'Software Intern 4', 'Amazon', 'Tech', 'This be a cool job'),
(5, 'Software Intern 5', 'Netflix', 'Tech', 'This be a cool job');

INSERT INTO jobs_to_user (jobID, username) VALUES
(2, 'user1'),(3, 'user1'),
(1, 'user2'),
(1, 'user3'),(4, 'user3'),(5, 'user3'),
(1, 'user4'),(2, 'user4'),(3, 'user4'),(4, 'user4'),
(1, 'user5'),(2, 'user5'),(3, 'user5'),(4, 'user5'),(5, 'user5');
