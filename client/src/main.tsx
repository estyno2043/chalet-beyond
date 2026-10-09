import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Not needed for the first paint; kept out of the entry bundle.
void import("./lib/smooth-scroll").then(module => module.startSmoothScroll());
