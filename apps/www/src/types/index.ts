export type UserId = string & { __brand: "UserId" };
export type ToolId = string & { __brand: "ToolId" };

export interface DXUser {
  id: UserId;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
  type: "message" | "system" | "join" | "leave";
}

export interface ChatUser {
  id: string;
  username: string;
  avatar: string;
  joinedAt: number;
}

export interface DocPage {
  title: string;
  description: string;
  slug: string;
  content: string;
  headings: DocHeading[];
  tool: string;
  order: number;
}

export interface DocHeading {
  id: string;
  title: string;
  depth: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
}

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
