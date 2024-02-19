import { User } from './user';

export interface Thread {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  ownerId: string;
  upVotesBy: string[];
  downVotesBy: string[];
  totalComments: number;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  owner: User;
  upVotesBy: string[];
  downVotesBy: string[];
}

export interface ThreadDetails {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  owner: User;
  upVotesBy: string[];
  downVotesBy: string[];
  comments: Comment[];
}
