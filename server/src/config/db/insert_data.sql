USE college_database;

-- 1. Insert System Administrator
INSERT INTO system_admin (username, password_hash) 
VALUES ('admin_root', 'hashed_password_123');

-- 2. Insert Students
INSERT INTO student (first_name, last_name, email, password_hash) VALUES
('Alice', 'Smith', 'alice.s@college.edu', 'hash1'),
('Bob', 'Jones', 'bob.j@college.edu', 'hash2'),
('Charlie', 'Brown', 'charlie.b@college.edu', 'hash3');

-- 3. Insert Departments (Leave head_instructor_id NULL for now)
INSERT INTO department (department_name) VALUES
('Computer Science'),
('Mathematics');

-- 4. Insert Instructors and assign them to Departments
INSERT INTO instructor (first_name, last_name, email, password_hash, department_id) VALUES
('Alan', 'Turing', 'aturing@college.edu', 'hash4', 1),    -- CS (ID 1)
('Grace', 'Hopper', 'ghopper@college.edu', 'hash5', 1),   -- CS (ID 1)
('Isaac', 'Newton', 'inewton@college.edu', 'hash6', 2);   -- Math (ID 2)

-- 5. Update Departments to assign Department Heads
UPDATE department SET head_instructor_id = 1 WHERE department_id = 1; -- Alan Turing heads CS
UPDATE department SET head_instructor_id = 3 WHERE department_id = 2; -- Isaac Newton heads Math

-- 6. Insert Courses and assign to Departments and Instructors
INSERT INTO course (course_name, credits, department_id, instructor_id) VALUES
('Intro to Programming', 3, 1, 2),  -- Taught by Grace Hopper
('Data Structures', 4, 1, 1),       -- Taught by Alan Turing
('Calculus I', 4, 2, 3);            -- Taught by Isaac Newton

-- 7. Insert Enrollments (Now includes Semester)
INSERT INTO enrollment (student_id, course_id, semester, grade) VALUES
(1, 1, 'Fall 2025', 'A'),     -- Alice took Intro to Programming last Fall
(1, 2, 'Spring 2026', 'B+'),  -- Alice took Data Structures in the Spring
(2, 1, 'Fall 2025', 'A-'),    -- Bob took Intro to Programming last Fall
(2, 3, 'Fall 2026', NULL),    -- Bob is in Calculus I this coming Fall (no grade yet)
(3, 2, 'Fall 2026', NULL);    -- Charlie is in Data Structures this coming Fall (no grade yet)