USE college_database;

-- 1. Insert Students
INSERT INTO student (student_code, first_name, last_name, dob, major, admission_year, email, status) VALUES
('S001', 'Alice', 'Smith', '2006-04-12', 'Computer Science', 2024, 'alice.s@college.edu', 'active'),
('S002', 'Bob', 'Jones', '2005-09-03', 'Mathematics', 2023, 'bob.j@college.edu', 'active'),
('S003', 'Charlie', 'Brown', '2007-01-25', 'Information Technology', 2025, 'charlie.b@college.edu', 'active');

-- 2. Insert Departments (Leave head_instructor_id NULL for now)
INSERT INTO department (department_name, status) VALUES
('Computer Science', 'active'),
('Mathematics', 'active');

-- 3. Insert Instructors and assign them to Departments
INSERT INTO instructor (instructor_code, first_name, last_name, email, department_id, status) VALUES
('I001', 'Alan', 'Turing', 'aturing@college.edu', 1, 'active'),    -- CS (ID 1)
('I002', 'Grace', 'Hopper', 'ghopper@college.edu', 1, 'active'),   -- CS (ID 1)
('I003', 'Isaac', 'Newton', 'inewton@college.edu', 2, 'active');   -- Math (ID 2)

-- 4. Update Departments to assign Department Heads
UPDATE department SET head_instructor_id = 1 WHERE department_id = 1; -- Alan Turing heads CS
UPDATE department SET head_instructor_id = 3 WHERE department_id = 2; -- Isaac Newton heads Math

-- 5. Insert Courses
INSERT INTO course (course_code, course_name, credits, department_id, status) VALUES
('CSIP01', 'Intro to Programming', 3, 1, 'active'),
('CSDS01', 'Data Structures', 4, 1, 'active'),
('MACA01', 'Calculus I', 4, 2, 'active');

-- 5a. Assign Instructors to Courses with Schedule Info
INSERT INTO course_instructor (course_id, instructor_id, day_of_week, start_period, end_period, status) VALUES
(1, 2, 'Monday', 1, 4, 'active'),     -- CSIP01 taught by Grace Hopper on Monday, periods 1-4
(2, 1, 'Wednesday', 3, 5, 'active'),  -- CSDS01 taught by Alan Turing on Wednesday, periods 3-5
(3, 3, 'Friday', 6, 9, 'active');     -- MACA01 taught by Isaac Newton on Friday, periods 6-9

-- 6. Insert Enrollments (Now includes Semester)
INSERT INTO enrollment (student_id, course_id, semester, grade, status) VALUES
(1, 1, '20251', 'A', 'active'),
(1, 2, '20252', 'B+', 'active'), 
(2, 1, '20251', 'A-', 'active'),   
(2, 3, '20261', NULL, 'active'),    
(3, 2, '20261', NULL, 'active');

INSERT INTO user (username, role, password_hash)
VALUES ('secret_admin', 'ADMIN', '$2b$10$jROwF5bjfZMLJT9WMuiX1etTgYloOPpVKvgvJO2KowjVW6cjpdKHS');