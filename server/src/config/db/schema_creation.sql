DROP DATABASE IF EXISTS college_database;
CREATE DATABASE college_database;
USE college_database;

CREATE TABLE student (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    student_code VARCHAR(10) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    major VARCHAR(100) NOT NULL,
    admission_year YEAR NOT NULL DEFAULT (YEAR(CURRENT_DATE)),
    email VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'active' NOT NULL,
    CONSTRAINT chk_student_code_format CHECK (student_code REGEXP '^S[A-Z]*[0-9]{3,}$')
);

-- Create department table (head_instructor_id foreign key added later)
CREATE TABLE department (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    head_instructor_id INT UNIQUE,
    status VARCHAR(20) DEFAULT 'active' NOT NULL
);

CREATE TABLE instructor (
    instructor_id INT PRIMARY KEY AUTO_INCREMENT,
    instructor_code VARCHAR(10) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department_id INT,
    status VARCHAR(20) DEFAULT 'active' NOT NULL,
    CONSTRAINT chk_instructor_code_format CHECK (instructor_code REGEXP '^I[A-Z]*[0-9]{3,}$'),
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);

CREATE TABLE user (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    role ENUM('student', 'instructor', 'admin') NOT NULL,
    student_id INT UNIQUE,
    instructor_id INT UNIQUE,
    password_hash VARCHAR(255) NOT NULL DEFAULT 'unset',
    status VARCHAR(20) DEFAULT 'active' NOT NULL,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (instructor_id) REFERENCES instructor(instructor_id)
);

DELIMITER //

CREATE TRIGGER trg_student_after_insert
AFTER INSERT ON student
FOR EACH ROW
BEGIN
    INSERT INTO user (username, role, student_id)
    VALUES (NEW.student_code, 'student', NEW.student_id);
END//

CREATE TRIGGER trg_instructor_after_insert
AFTER INSERT ON instructor
FOR EACH ROW
BEGIN
    INSERT INTO user (username, role, instructor_id)
    VALUES (NEW.instructor_code, 'instructor', NEW.instructor_id);
END//

CREATE TRIGGER trg_student_before_code_update
BEFORE UPDATE ON student
FOR EACH ROW
BEGIN
    IF NOT (NEW.student_code <=> OLD.student_code) THEN
		BEGIN
			UPDATE user SET username = NEW.student_code
			WHERE student_id = NEW.student_id;
		END;
    END IF;
END//

CREATE TRIGGER trg_instructor_before_code_update
BEFORE UPDATE ON instructor
FOR EACH ROW
BEGIN
    IF NOT (NEW.instructor_code <=> OLD.instructor_code) THEN
		BEGIN
			UPDATE user SET username = NEW.instructor_code
			WHERE instructor_id = NEW.instructor_id;
		END;
    END IF;
END//

DELIMITER ;

-- Resolve mutual dependency: Add the foreign key for Department Head
ALTER TABLE department
ADD CONSTRAINT fk_department_head 
FOREIGN KEY (head_instructor_id) REFERENCES instructor(instructor_id);

CREATE TABLE course (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(10) NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    credits INT NOT NULL,
    department_id INT,
    instructor_id INT,
    status VARCHAR(20) DEFAULT 'active' NOT NULL,
    CONSTRAINT chk_course_code_format CHECK (course_code REGEXP '^[A-Z]+[0-9]+$'),
    FOREIGN KEY (department_id) REFERENCES department(department_id),
    FOREIGN KEY (instructor_id) REFERENCES instructor(instructor_id)
);

CREATE TABLE enrollment (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT,
    semester VARCHAR(5) NOT NULL, -- e.g., 'Fall 2026'
    grade VARCHAR(5),
    status VARCHAR(20) DEFAULT 'active' NOT NULL,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (course_id) REFERENCES course(course_id),
    CONSTRAINT check_semester CHECK (semester REGEXP '^[0-9]{5}$')
);

-- Add indexes to enrollment table
ALTER TABLE enrollment
  ADD CONSTRAINT uq_enrollment UNIQUE (student_id, course_id, semester),
  ADD INDEX idx_enrollment_course_sem_status_student (course_id, semester, status, student_id),
  ADD INDEX idx_enrollment_student_sem_status_course (student_id, semester, status, course_id);

-- Create View for data-enriched Instructor table
CREATE VIEW `instructor_view` AS (
SELECT 
    instructor_id, 
    instructor_code, 
    first_name, 
    last_name, 
    email, 
    i.department_id,
    department_name, 
    i.status
FROM instructor i LEFT JOIN department d
    ON i.department_id = d.department_id
);

-- Create View for data-enriched Department table
CREATE VIEW `department_view` AS (
SELECT 
    d.department_id, 
    department_name, 
    head_instructor_id, 
    first_name AS ins_fname,
    last_name AS ins_lname,
    d.status
FROM department d LEFT JOIN instructor i
    ON d.head_instructor_id = i.instructor_id
);

-- Create View for data-enriched Course table
CREATE VIEW `course_view` AS (
SELECT
    c.course_id,
    c.course_code,
    c.course_name,
    c.credits,
    c.department_id,
    d.department_name,
    c.instructor_id,
    i.instructor_code,
    i.first_name AS ins_fname,
    i.last_name AS ins_lname,
    c.status,
    COUNT(e.enrollment_id) AS enrollment_count
FROM course c
LEFT JOIN department d
    ON c.department_id = d.department_id
LEFT JOIN instructor i
    ON c.instructor_id = i.instructor_id
LEFT JOIN enrollment e
    ON c.course_id = e.course_id
GROUP BY
    c.course_id,
    c.course_code,
    c.course_name,
    c.credits,
    c.department_id,
    d.department_name,
    c.instructor_id,
    i.instructor_code,
    i.first_name,
    i.last_name,
    c.status
);