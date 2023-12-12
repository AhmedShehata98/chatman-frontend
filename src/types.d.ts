interface Signup {
  fullName: string;
  email: string;
  password: string;
  profilePictureUrl?: string;
}

interface Login {
  email: string;
  password: string;
}
interface UserContacts {
  _id: string;
  user: Partial<User>;
  conversation: Conversation;
}

interface CreateConversation {
  participants: Array<string>;
  conversationType: "PRIVATE" | "GROUP";
  conversationAdmin?: string;
  conversationName?: string;
  conversationDescription?: string;
  conversationImage?: string;
}
interface Conversation {
  participants: User[];
  conversationType: "PRIVATE" | "GROUP";
  conversation: Omit<CreateConversation, "participants" | "conversationType">;
  updatedAt: string;
  createdAt: string;
  lastMessage: {
    message: string;
    sender: string;
    _id: string;
  };
}
interface User {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  updatedAt: string;
  createdAt: string;
  status: UserStatusType;
  lastSeenDate: number;
  userContacts: Array<UserContacts>;
  userGroups: Array<UserContacts>;
  profilePictureUrl: string;
}
type UserStatusType = "OFFLINE" | "ONLINE" | "IDLE";

interface SearchResult {
  _id: string;
  username: string;
  fullName: string;
  profilePictureUrl: string;
  updatedAt: string;
  createdAt: string;
}
interface Conversation {
  _id: string;
  participants: {
    sender: Partial<User>;
    receiver: Partial<User>;
  };
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  _id: string;
  conversationId: string;
  message: string;
  media: string;
  sender: Partial<User>;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Post {
  _id: string;
  feedRoom: IFeed;
  publisher: User;
  content: { text: string; media: string };
  createdAt: string;
  updatedAt: string;
}

interface CreatePost {
  publisher: string;
  feedRoom: string;
  content: { text: string; media: string };
}

interface UploadResult {
  bytes: number;
  created_at: string;
  format: string;
  height: number;
  secure_url: string;
  url: string;
  width: number;
}

interface IFeed {
  _id: string;
  feedName: string;
  feedCover: string;
  isPrivate: boolean;
  description: string;
  owner: IUser;
  createdAt: string;
  updatedAt: string;
  posts: IPost[];
  followersLength: number;
  followers: [];
}
interface CreateFeed {
  feedName: string;
  feedCover: string | undefined;
  isPrivate: boolean;
  description: string | undefined;
  owner?: string;
  posts?: CreatePost[];
}
