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

-- ==================================================
-- Additional bulk sample data (students, depts, instructors, courses, enrollments)
-- ==================================================

-- Add more departments
INSERT INTO department (department_name, status) VALUES
('Physics', 'active'),
('Chemistry', 'active'),
('Biology', 'active'),
('English', 'active'),
('History', 'active'),
('Economics', 'active'),
('Business', 'active'),
('Art', 'active'),
('Psychology', 'active');

-- Add many students
INSERT INTO student (student_code, first_name, last_name, dob, major, admission_year, email, status) VALUES
('S004', 'David', 'Lee', '2005-03-15', 'Physics', 2023, 'david.lee@college.edu', 'active'),
('S005', 'Emma', 'Wilson', '2006-07-22', 'Chemistry', 2024, 'emma.wilson@college.edu', 'active'),
('S006', 'Frank', 'Garcia', '2004-11-02', 'Biology', 2022, 'frank.garcia@college.edu', 'active'),
('S007', 'Grace', 'Kim', '2005-01-17', 'English', 2023, 'grace.kim@college.edu', 'active'),
('S008', 'Hannah', 'Wright', '2006-05-04', 'History', 2024, 'hannah.wright@college.edu', 'active'),
('S009', 'Ian', 'Lopez', '2005-12-30', 'Economics', 2023, 'ian.lopez@college.edu', 'active'),
('S010', 'Julia', 'Martinez', '2007-02-08', 'Business', 2025, 'julia.martinez@college.edu', 'active'),
('S011', 'Kevin', 'Davis', '2006-06-20', 'Art', 2024, 'kevin.davis@college.edu', 'active'),
('S012', 'Laura', 'Clark', '2005-09-09', 'Psychology', 2023, 'laura.clark@college.edu', 'active'),
('S013', 'Michael', 'Rodriguez', '2004-04-27', 'Computer Science', 2022, 'michael.rodriguez@college.edu', 'active'),
('S014', 'Nina', 'Lewis', '2006-10-11', 'Information Technology', 2024, 'nina.lewis@college.edu', 'active'),
('S015', 'Oliver', 'Walker', '2005-08-02', 'Mathematics', 2023, 'oliver.walker@college.edu', 'active'),
('S016', 'Paula', 'Hall', '2006-03-03', 'Computer Science', 2024, 'paula.hall@college.edu', 'active'),
('S017', 'Quentin', 'Allen', '2005-11-14', 'Physics', 2023, 'quentin.allen@college.edu', 'active'),
('S018', 'Rachel', 'Young', '2007-07-07', 'Chemistry', 2025, 'rachel.young@college.edu', 'active'),
('S019', 'Samuel', 'Hernandez', '2006-02-19', 'Biology', 2024, 'samuel.hernandez@college.edu', 'active'),
('S020', 'Tina', 'King', '2005-05-25', 'English', 2023, 'tina.king@college.edu', 'active'),
('S021', 'Umar', 'Lopez', '2006-12-12', 'History', 2024, 'umar.lopez@college.edu', 'active'),
('S022', 'Vera', 'Scott', '2007-09-15', 'Economics', 2025, 'vera.scott@college.edu', 'active'),
('S023', 'Wesley', 'Green', '2004-01-30', 'Business', 2022, 'wesley.green@college.edu', 'active'),
('S024', 'Ximena', 'Adams', '2006-08-08', 'Art', 2024, 'ximena.adams@college.edu', 'active'),
('S025', 'Yusuf', 'Baker', '2005-10-01', 'Psychology', 2023, 'yusuf.baker@college.edu', 'active'),
('S026', 'Zoe', 'Nelson', '2006-04-04', 'Computer Science', 2024, 'zoe.nelson@college.edu', 'active'),
('S027', 'Aaron', 'Carter', '2004-06-06', 'Information Technology', 2022, 'aaron.carter@college.edu', 'active'),
('S028', 'Bianca', 'Reed', '2005-02-02', 'Mathematics', 2023, 'bianca.reed@college.edu', 'active'),
('S029', 'Carlos', 'Murphy', '2006-09-26', 'Computer Science', 2024, 'carlos.murphy@college.edu', 'active'),
('S030', 'Diana', 'Cook', '2007-01-05', 'Biology', 2025, 'diana.cook@college.edu', 'active'),
('S031', 'Ethan', 'Bell', '2005-07-18', 'Physics', 2023, 'ethan.bell@college.edu', 'active'),
('S032', 'Fiona', 'Ward', '2006-11-23', 'Chemistry', 2024, 'fiona.ward@college.edu', 'active'),
('S033', 'Gavin', 'Patterson', '2004-03-29', 'History', 2022, 'gavin.patterson@college.edu', 'active'),
('S034', 'Holly', 'Ross', '2006-12-18', 'Economics', 2024, 'holly.ross@college.edu', 'active'),
('S035', 'Ibrahim', 'Price', '2005-05-09', 'Business', 2023, 'ibrahim.price@college.edu', 'active'),
('S036', 'Jade', 'Reynolds', '2007-04-14', 'Art', 2025, 'jade.reynolds@college.edu', 'active'),
('S037', 'Kyle', 'Foster', '2006-02-28', 'Psychology', 2024, 'kyle.foster@college.edu', 'active'),
('S038', 'Lila', 'Gomez', '2005-09-19', 'Mathematics', 2023, 'lila.gomez@college.edu', 'active'),
('S039', 'Mason', 'Diaz', '2004-08-21', 'Computer Science', 2022, 'mason.diaz@college.edu', 'active'),
('S040', 'Nora', 'Hayes', '2006-01-02', 'Information Technology', 2024, 'nora.hayes@college.edu', 'active'),
('S041', 'Omar', 'Jordan', '2005-03-12', 'Physics', 2023, 'omar.jordan@college.edu', 'active'),
('S042', 'Priya', 'Khan', '2006-06-30', 'Chemistry', 2024, 'priya.khan@college.edu', 'active'),
('S043', 'Ravi', 'Patel', '2007-10-10', 'Biology', 2025, 'ravi.patel@college.edu', 'active');

-- Add more instructors (use department lookup to assign)
INSERT INTO instructor (instructor_code, first_name, last_name, email, department_id, status) VALUES
('I004', 'Marie', 'Curie', 'mcurie@college.edu', (SELECT department_id FROM department WHERE department_name='Physics' LIMIT 1), 'active'),
('I005', 'Niels', 'Bohr', 'nbohr@college.edu', (SELECT department_id FROM department WHERE department_name='Physics' LIMIT 1), 'active'),
('I006', 'Rosalind', 'Franklin', 'rfranklin@college.edu', (SELECT department_id FROM department WHERE department_name='Chemistry' LIMIT 1), 'active'),
('I007', 'Charles', 'Darwin', 'cdarwin@college.edu', (SELECT department_id FROM department WHERE department_name='Biology' LIMIT 1), 'active'),
('I008', 'William', 'Shakespeare', 'wshakespeare@college.edu', (SELECT department_id FROM department WHERE department_name='English' LIMIT 1), 'active'),
('I009', 'Herodotus', 'Historian', 'herodotus@college.edu', (SELECT department_id FROM department WHERE department_name='History' LIMIT 1), 'active'),
('I010', 'Adam', 'Smith', 'asmith@college.edu', (SELECT department_id FROM department WHERE department_name='Economics' LIMIT 1), 'active'),
('I011', 'Peter', 'Drucker', 'pdrucker@college.edu', (SELECT department_id FROM department WHERE department_name='Business' LIMIT 1), 'active'),
('I012', 'Frida', 'Kahlo', 'fkahlo@college.edu', (SELECT department_id FROM department WHERE department_name='Art' LIMIT 1), 'active'),
('I013', 'Sigmund', 'Freud', 'sfreud@college.edu', (SELECT department_id FROM department WHERE department_name='Psychology' LIMIT 1), 'active');

-- Add more courses using department lookup
INSERT INTO course (course_code, course_name, credits, department_id, status) VALUES
('PHYS01', 'Classical Mechanics', 4, (SELECT department_id FROM department WHERE department_name='Physics' LIMIT 1), 'active'),
('PHYS02', 'Electromagnetism', 4, (SELECT department_id FROM department WHERE department_name='Physics' LIMIT 1), 'active'),
('CHEM01', 'General Chemistry', 4, (SELECT department_id FROM department WHERE department_name='Chemistry' LIMIT 1), 'active'),
('BIO01', 'General Biology', 3, (SELECT department_id FROM department WHERE department_name='Biology' LIMIT 1), 'active'),
('ENG01', 'English Literature', 3, (SELECT department_id FROM department WHERE department_name='English' LIMIT 1), 'active'),
('HIST01', 'World History', 3, (SELECT department_id FROM department WHERE department_name='History' LIMIT 1), 'active'),
('ECON01', 'Microeconomics', 3, (SELECT department_id FROM department WHERE department_name='Economics' LIMIT 1), 'active'),
('BUS01', 'Principles of Management', 3, (SELECT department_id FROM department WHERE department_name='Business' LIMIT 1), 'active'),
('ART01', 'Introduction to Art', 2, (SELECT department_id FROM department WHERE department_name='Art' LIMIT 1), 'active'),
('PSYC01', 'Intro to Psychology', 3, (SELECT department_id FROM department WHERE department_name='Psychology' LIMIT 1), 'active');

-- Map instructors to the new courses (use subqueries to resolve ids)
INSERT INTO course_instructor (course_id, instructor_id, day_of_week, start_period, end_period, status) VALUES
((SELECT course_id FROM course WHERE course_code='PHYS01' LIMIT 1), (SELECT instructor_id FROM instructor WHERE instructor_code='I004' LIMIT 1), 'Tuesday', 2, 5, 'active'),
((SELECT course_id FROM course WHERE course_code='PHYS02' LIMIT 1), (SELECT instructor_id FROM instructor WHERE instructor_code='I005' LIMIT 1), 'Thursday', 2, 5, 'active'),
((SELECT course_id FROM course WHERE course_code='CHEM01' LIMIT 1), (SELECT instructor_id FROM instructor WHERE instructor_code='I006' LIMIT 1), 'Monday', 3, 6, 'active'),
((SELECT course_id FROM course WHERE course_code='BIO01' LIMIT 1), (SELECT instructor_id FROM instructor WHERE instructor_code='I007' LIMIT 1), 'Wednesday', 1, 3, 'active'),
((SELECT course_id FROM course WHERE course_code='ENG01' LIMIT 1), (SELECT instructor_id FROM instructor WHERE instructor_code='I008' LIMIT 1), 'Friday', 2, 4, 'active'),
((SELECT course_id FROM course WHERE course_code='HIST01' LIMIT 1), (SELECT instructor_id FROM instructor WHERE instructor_code='I009' LIMIT 1), 'Tuesday', 6, 8, 'active'),
((SELECT course_id FROM course WHERE course_code='ECON01' LIMIT 1), (SELECT instructor_id FROM instructor WHERE instructor_code='I010' LIMIT 1), 'Thursday', 1, 3, 'active'),
((SELECT course_id FROM course WHERE course_code='BUS01' LIMIT 1), (SELECT instructor_id FROM instructor WHERE instructor_code='I011' LIMIT 1), 'Wednesday', 4, 6, 'active'),
((SELECT course_id FROM course WHERE course_code='ART01' LIMIT 1), (SELECT instructor_id FROM instructor WHERE instructor_code='I012' LIMIT 1), 'Monday', 6, 8, 'active'),
((SELECT course_id FROM course WHERE course_code='PSYC01' LIMIT 1), (SELECT instructor_id FROM instructor WHERE instructor_code='I013' LIMIT 1), 'Friday', 6, 8, 'active');

-- Enroll many students into a selection of courses across semesters
INSERT INTO enrollment (student_id, course_id, semester, grade, status) VALUES
((SELECT student_id FROM student WHERE student_code='S004' LIMIT 1), (SELECT course_id FROM course WHERE course_code='PHYS01' LIMIT 1), '20261', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S005' LIMIT 1), (SELECT course_id FROM course WHERE course_code='CHEM01' LIMIT 1), '20261', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S006' LIMIT 1), (SELECT course_id FROM course WHERE course_code='BIO01' LIMIT 1), '20261', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S007' LIMIT 1), (SELECT course_id FROM course WHERE course_code='ENG01' LIMIT 1), '20261', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S008' LIMIT 1), (SELECT course_id FROM course WHERE course_code='HIST01' LIMIT 1), '20261', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S009' LIMIT 1), (SELECT course_id FROM course WHERE course_code='ECON01' LIMIT 1), '20261', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S010' LIMIT 1), (SELECT course_id FROM course WHERE course_code='BUS01' LIMIT 1), '20261', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S011' LIMIT 1), (SELECT course_id FROM course WHERE course_code='ART01' LIMIT 1), '20261', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S012' LIMIT 1), (SELECT course_id FROM course WHERE course_code='PSYC01' LIMIT 1), '20261', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S013' LIMIT 1), (SELECT course_id FROM course WHERE course_code='PHYS02' LIMIT 1), '20261', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S014' LIMIT 1), (SELECT course_id FROM course WHERE course_code='PHYS01' LIMIT 1), '20251', 'B', 'active'),
((SELECT student_id FROM student WHERE student_code='S015' LIMIT 1), (SELECT course_id FROM course WHERE course_code='CHEM01' LIMIT 1), '20251', 'A-', 'active'),
((SELECT student_id FROM student WHERE student_code='S016' LIMIT 1), (SELECT course_id FROM course WHERE course_code='BIO01' LIMIT 1), '20252', 'B+', 'active'),
((SELECT student_id FROM student WHERE student_code='S017' LIMIT 1), (SELECT course_id FROM course WHERE course_code='ENG01' LIMIT 1), '20252', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S018' LIMIT 1), (SELECT course_id FROM course WHERE course_code='HIST01' LIMIT 1), '20252', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S019' LIMIT 1), (SELECT course_id FROM course WHERE course_code='ECON01' LIMIT 1), '20251', 'A', 'active'),
((SELECT student_id FROM student WHERE student_code='S020' LIMIT 1), (SELECT course_id FROM course WHERE course_code='BUS01' LIMIT 1), '20251', 'B+', 'active'),
((SELECT student_id FROM student WHERE student_code='S021' LIMIT 1), (SELECT course_id FROM course WHERE course_code='ART01' LIMIT 1), '20252', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S022' LIMIT 1), (SELECT course_id FROM course WHERE course_code='PSYC01' LIMIT 1), '20252', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S023' LIMIT 1), (SELECT course_id FROM course WHERE course_code='PHYS02' LIMIT 1), '20261', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S024' LIMIT 1), (SELECT course_id FROM course WHERE course_code='CHEM01' LIMIT 1), '20261', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S025' LIMIT 1), (SELECT course_id FROM course WHERE course_code='BIO01' LIMIT 1), '20261', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S026' LIMIT 1), (SELECT course_id FROM course WHERE course_code='ENG01' LIMIT 1), '20261', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S027' LIMIT 1), (SELECT course_id FROM course WHERE course_code='HIST01' LIMIT 1), '20261', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S028' LIMIT 1), (SELECT course_id FROM course WHERE course_code='ECON01' LIMIT 1), '20261', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S029' LIMIT 1), (SELECT course_id FROM course WHERE course_code='BUS01' LIMIT 1), '20261', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S030' LIMIT 1), (SELECT course_id FROM course WHERE course_code='ART01' LIMIT 1), '20261', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S031' LIMIT 1), (SELECT course_id FROM course WHERE course_code='PSYC01' LIMIT 1), '20261', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S032' LIMIT 1), (SELECT course_id FROM course WHERE course_code='PHYS01' LIMIT 1), '20262', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S033' LIMIT 1), (SELECT course_id FROM course WHERE course_code='CHEM01' LIMIT 1), '20262', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S034' LIMIT 1), (SELECT course_id FROM course WHERE course_code='BIO01' LIMIT 1), '20262', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S035' LIMIT 1), (SELECT course_id FROM course WHERE course_code='ENG01' LIMIT 1), '20262', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S036' LIMIT 1), (SELECT course_id FROM course WHERE course_code='HIST01' LIMIT 1), '20262', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S037' LIMIT 1), (SELECT course_id FROM course WHERE course_code='ECON01' LIMIT 1), '20262', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S038' LIMIT 1), (SELECT course_id FROM course WHERE course_code='BUS01' LIMIT 1), '20262', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S039' LIMIT 1), (SELECT course_id FROM course WHERE course_code='ART01' LIMIT 1), '20262', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S040' LIMIT 1), (SELECT course_id FROM course WHERE course_code='PSYC01' LIMIT 1), '20262', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S041' LIMIT 1), (SELECT course_id FROM course WHERE course_code='PHYS02' LIMIT 1), '20262', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S042' LIMIT 1), (SELECT course_id FROM course WHERE course_code='CHEM01' LIMIT 1), '20262', NULL, 'active'),
((SELECT student_id FROM student WHERE student_code='S043' LIMIT 1), (SELECT course_id FROM course WHERE course_code='BIO01' LIMIT 1), '20262', NULL, 'active');
