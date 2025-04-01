export interface User {
    id: number;
    username: string;
    password: string;
  }
  
  export const mockUsers: User[] = [
    { id: 1, username: 'testuser', password: 'password123' },
  ];
  