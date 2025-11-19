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
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data = await response.json();
  return {
    user: data.user,
    token: data.token,
  };
}

// Function to call API for signup
export async function signupUser(
  data: SignupData
): Promise<{ user: User; token: string }> {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Signup failed');
  }

  const result = await response.json();
  
  // For signup, we don't get a token, so we'll return the user and a placeholder token
  // The user will need to login after signup
  return {
    user: result.user,
    token: '', // No token on signup, user needs to login
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

