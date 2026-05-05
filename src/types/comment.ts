export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface Comment {
  id: number;
  user: GitHubUser;
  created_at: string;
  updated_at: string;
  body: string;
  html_url: string;
}
