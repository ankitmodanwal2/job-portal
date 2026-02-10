-- Create databases for all services
CREATE DATABASE IF NOT EXISTS user_db;
CREATE DATABASE IF NOT EXISTS job_db;
CREATE DATABASE IF NOT EXISTS application_db;

-- Grant privileges
GRANT ALL PRIVILEGES ON user_db.* TO 'myuser'@'%';
GRANT ALL PRIVILEGES ON job_db.* TO 'myuser'@'%';
GRANT ALL PRIVILEGES ON application_db.* TO 'myuser'@'%';

FLUSH PRIVILEGES;