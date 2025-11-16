// Define the User type
export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
}

// Define the Login credentials type
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}


//this will call backend API
export async function loginUser(
  credentials: LoginCredentials
): Promise<{ user: User; token: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockUser: User = {
    id: "1",
    name: credentials.email.split("@")[0], // Use email prefix as name
    email: credentials.email,
    bio: "Welcome to Medium Clone!",
    avatar: undefined,
  };

  // Mock token 
  const mockToken = "mock-jwt-token-" + Date.now();

  return {
    user: mockUser,
    token: mockToken,
  };
}

// Function to simulate API call for signup
export async function signupUser(
  data: SignupData
): Promise<{ user: User; token: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));


  const mockUser: User = {
    id: Date.now().toString(), 
    name: data.name,
    email: data.email,
    bio: "New user on Medium Clone",
    avatar: undefined,
  };

  const mockToken = "mock-jwt-token-" + Date.now();

  return {
    user: mockUser,
    token: mockToken,
  };
}

// Function to logout user
export function logoutUser(): void {
  // Remove token from localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  }
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;

  const userData = localStorage.getItem("user_data");
  if (!userData) return null;

  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
}

// Function to get stored token
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

// Function to save user data and token
export function saveAuthData(user: User, token: string): void {
  if (typeof window === "undefined") return;

  localStorage.setItem("user_data", JSON.stringify(user));
  localStorage.setItem("auth_token", token);
}

