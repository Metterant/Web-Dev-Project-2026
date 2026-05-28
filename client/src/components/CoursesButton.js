import { useNavigate } from "react-router-dom";
import './CoursesButton.css'

export default function BackButton({ courses_screen }) {
  const navigate = useNavigate();

  return (
    <div className="courses-button">
      <button onClick={() => {
        if (courses_screen && courses_screen !== '') {
          navigate(courses_screen);
        }
      }}>
        View Courses {'>'}
      </button>
    </div>
  );
}