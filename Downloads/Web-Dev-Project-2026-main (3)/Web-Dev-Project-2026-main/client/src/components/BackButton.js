import { useNavigate } from "react-router-dom";
import './BackButton.css'

export default function BackButton({ previous_screen }) {
  const navigate = useNavigate();

  return (
    <div className="back-button">
      <button onClick={() => {
        if (previous_screen && previous_screen !== '') {
          navigate(previous_screen);
        } else {
          // fallback: go back in history
          navigate(-1);
        }
      }}>
        {'<'} Back
      </button>
    </div>
  );
}