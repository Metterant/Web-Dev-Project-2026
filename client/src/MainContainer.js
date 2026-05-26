import "./MainContainer.css";
import NavBar from "./components/NavBar";

// Following the BEM conventions

function MainContainer({ children }) {
  return (
    <div className="container">
      <NavBar />
      <main className="container-main">
        {children}
      </main>
    </div>
  );
}

export default MainContainer;
