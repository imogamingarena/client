// App.js
import "./globals.css";
import IMOHeader from "../components/IMOHeader";
import ContactUS from "../components/ContactUs";

function App() {
  return (
    <div className="App">
      <IMOHeader />
      <ContactUS />
      <main
        style={{
          padding: "20px",
          color: "#fff",
          background: "#0a0e17",
          minHeight: "100vh",
        }}
      >
        <h2>IMO Gaming Arena Main Content</h2>
        <p>Your gaming content goes here...</p>
      </main>
    </div>
  );
}

export default App;
