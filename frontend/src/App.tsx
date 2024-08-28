import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LogIn from "./Components/LogIn";
import Register from "./Components/Register";
import { useState, createContext } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  token: string;
  createdAt: string;
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {},
});

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <BrowserRouter>
      <main>
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </UserContext.Provider>
      </main>
    </BrowserRouter>
  );
}
