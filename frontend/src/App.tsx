import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LogIn from "./Components/LogIn";
import Register from "./Components/Register";
import { useState, createContext } from "react";
import { Toaster } from "react-hot-toast";
import PostForm from "./Components/PostForm";

export interface User {
  user_id: number;
  name: string;
  email: string;
  token: string;
  createdAt: string;
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {},
});

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <BrowserRouter>
      <main>
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
          <Toaster
            containerStyle={{
              top: "10rem",
            }}
          />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/diary" element={<PostForm />} />
            <Route path="/*" element={<div>Uh oh.. you are lost</div>} />
          </Routes>
        </UserContext.Provider>
      </main>
    </BrowserRouter>
  );
}
