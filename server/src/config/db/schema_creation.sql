DROP DATABASE IF EXISTS college_database;
CREATE DATABASE college_database;
USE college_database;

CREATE TABLE system_admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE student (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    student_code VARCHAR(10) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    major VARCHAR(100) NOT NULL,
    admission_year YEAR NOT NULL DEFAULT (YEAR(CURRENT_DATE)),
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL DEFAULT 'unset',
    status VARCHAR(20) DEFAULT 'active' NOT NULL
);

-- Create department table (head_instructor_id foreign key added later)
CREATE TABLE department (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    head_instructor_id INT UNIQUE,
    status VARCHAR(20) DEFAULT 'active' NOT NULL
);

CREATE TABLE instructor (
    instructor_id INT PRIMARY KEY AUTO_INCREMENT,
    instructor_code VARCHAR(10) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    department_id INT,
    status VARCHAR(20) DEFAULT 'active' NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);

-- Resolve mutual dependency: Add the foreign key for Department Head
ALTER TABLE department
ADD CONSTRAINT fk_department_head 
FOREIGN KEY (head_instructor_id) REFERENCES instructor(instructor_id);

CREATE TABLE course (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(10) NOT NULL UNIQUE,
    course_name VARCHAR(100) NOT NULL,
    credits INT NOT NULL,
    department_id INT,
    instructor_id INT,
    status VARCHAR(20) DEFAULT 'active' NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(department_id),
    FOREIGN KEY (instructor_id) REFERENCES instructor(instructor_id)
);

CREATE TABLE enrollment (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT,
    semester VARCHAR(20) NOT NULL, -- e.g., 'Fall 2026'
    grade VARCHAR(5),
    status VARCHAR(20) DEFAULT 'active' NOT NULL,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (course_id) REFERENCES course(course_id)
);