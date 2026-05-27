import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; 

import App from './App';
import Login from './pages/auth/Login';
import ResetPassword from './pages/auth/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';

// Lists
import StudentList from './pages/list_pages/StudentList';
import CourseList from './pages/list_pages/CourseList';
import InstructorList from './pages/list_pages/InstructorList';
import DepartmentList from './pages/list_pages/DepartmentList';

// Edits
import StudentEdit from './pages/edit_pages/StudentEdit';
import CourseEdit from './pages/edit_pages/CourseEdit';
import InstructorEdit from './pages/edit_pages/InstructorEdit';
import DepartmentEdit from './pages/edit_pages/DepartmentEdit';

const router = createBrowserRouter([
  { path: '/', element: <ProtectedRoute><App /></ProtectedRoute>},
  { path: '/login', element: <Login />},
  { path: '/reset_password', element: <ResetPassword />},
  { path: '/students', element: <ProtectedRoute><StudentList /></ProtectedRoute>},
  { path: '/students/:id', element: <ProtectedRoute><StudentEdit /></ProtectedRoute>},
  { path: '/courses', element: <ProtectedRoute><CourseList /></ProtectedRoute>},
  { path: '/courses/:id', element: <ProtectedRoute><CourseEdit /></ProtectedRoute>},
  { path: '/instructors', element: <ProtectedRoute><InstructorList /></ProtectedRoute>},
  { path: '/instructors/:id', element: <ProtectedRoute><InstructorEdit /></ProtectedRoute>},
  { path: '/departments', element: <ProtectedRoute><DepartmentList /></ProtectedRoute>},
  { path: '/departments/:id', element: <ProtectedRoute><DepartmentEdit /></ProtectedRoute>}
  // { path: '/dashboard'}
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
