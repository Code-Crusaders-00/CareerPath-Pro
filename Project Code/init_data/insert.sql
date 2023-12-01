INSERT INTO users (password, firstName, lastNAME, email) VALUES
( '$2b$10$KqcaD9PwuWwrietIJJSkFOWuWIdDQau6JezCBHd.CEJAtpmvp0MWe', 'user', '1', 'user1@gmail.com'), /* pass1 */
( '$2b$10$bRraxfxx1NBym1I1OHTTZuJw2xbmtaJE1ciNC1jZh41wo3lYJAKAa', 'user', '2', 'user2@gmail.com'), /* pass2 */
( '$2b$10$PglN5tMpEhrmOUJSS/LheOiMaSDzRQ2CyEXJTqr8v4gYv63IXtSN2', 'user', '3', 'user3@gmail.com'), /* pass3 */
( '$2b$10$9aHxZHSSxHUmhCy9fpr1mOtBBdpZRtp49UhRhLcFqRHCkv6ijSSGq', 'user', '4', 'user4@gmail.com'), /* pass4 */
( '$2b$10$xCmB8HrtD7naT1wxFntAbut3vPn2bswfcfp1MkOW3s07dcqzYBmhe', 'user', '5', 'user5@gmail.com'); /* pass5 */

INSERT INTO applications (name, company, industry, description, status) VALUES
('Software Intern 1', 'Google', 'Tech', 'This be a cool job', 'status'),
('Software Intern 2', 'Meta', 'Tech', 'This be a cool job', 'status'),
('Software Intern 3', 'Apple', 'Tech', 'This be a cool job', 'status'),
('Software Intern 4', 'Amazon', 'Tech', 'This be a cool job', 'status'),
('Software Intern 5', 'Netflix', 'Tech', 'This be a cool job', 'status');

INSERT INTO user_to_applications (userID, appID) VALUES
(6, 1);
