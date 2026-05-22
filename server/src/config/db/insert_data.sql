USE college_database;

-- 1. Insert System Administrator
INSERT INTO system_admin (username, password_hash) 
VALUES ('admin_root', 'hashed_password_123');

-- 2. Insert Students
INSERT INTO student (student_code, first_name, last_name, dob, major, admission_year, email, password_hash, status) VALUES
('S001', 'Alice', 'Smith', '2006-04-12', 'Computer Science', 2024, 'alice.s@college.edu', 'hash1', 'active'),
('S002', 'Bob', 'Jones', '2005-09-03', 'Mathematics', 2023, 'bob.j@college.edu', 'hash2', 'active'),
('S003', 'Charlie', 'Brown', '2007-01-25', 'Information Technology', 2025, 'charlie.b@college.edu', 'hash3', 'active');

-- 3. Insert Departments (Leave head_instructor_id NULL for now)
INSERT INTO department (department_name, status) VALUES
('Computer Science', 'active'),
('Mathematics', 'active');

-- 4. Insert Instructors and assign them to Departments
INSERT INTO instructor (instructor_code, first_name, last_name, email, password_hash, department_id, status) VALUES
('F001', 'Alan', 'Turing', 'aturing@college.edu', 'hash4', 1, 'active'),    -- CS (ID 1)
('F002', 'Grace', 'Hopper', 'ghopper@college.edu', 'hash5', 1, 'active'),   -- CS (ID 1)
('F003', 'Isaac', 'Newton', 'inewton@college.edu', 'hash6', 2, 'active');   -- Math (ID 2)

-- 5. Update Departments to assign Department Heads
UPDATE department SET head_instructor_id = 1 WHERE department_id = 1; -- Alan Turing heads CS
UPDATE department SET head_instructor_id = 3 WHERE department_id = 2; -- Isaac Newton heads Math

-- 6. Insert Courses and assign to Departments and Instructors
INSERT INTO course (course_code, course_name, credits, department_id, instructor_id, status) VALUES
('CSIP01', 'Intro to Programming', 3, 1, 2, 'active'),  -- Taught by Grace Hopper
('CSDS01', 'Data Structures', 4, 1, 1, 'active'),       -- Taught by Alan Turing
('MACA01', 'Calculus I', 4, 2, 3, 'active');            -- Taught by Isaac Newton

-- 7. Insert Enrollments (Now includes Semester)
INSERT INTO enrollment (student_id, course_id, semester, grade, status) VALUES
(1, 1, 'Fall 2025', 'A', 'active'),     -- Alice took Intro to Programming last Fall
(1, 2, 'Spring 2026', 'B+', 'active'),  -- Alice took Data Structures in the Spring
(2, 1, 'Fall 2025', 'A-', 'active'),    -- Bob took Intro to Programming last Fall
(2, 3, 'Fall 2026', NULL, 'active'),    -- Bob is in Calculus I this coming Fall (no grade yet)
(3, 2, 'Fall 2026', NULL, 'active');    -- Charlie is in Data Structures this coming Fall (no grade yet)