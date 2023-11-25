interface Signup {
  fullName: string;
  username: string;
  email: string;
  password: string;
  phone: string;
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

interface User {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  createdAt: string;
  contacts: Array<UserContacts>;
  isOnline: boolean;
  profileImg: string;
}

interface Conversation {
  _id: string;
  participants: {
    sender: {
      _id: string;
      fullName: string;
      username: string;
      profileImg: string;
      isOnline: boolean;
    };
    receiver: {
      _id: string;
      fullName: string;
      username: string;
      profileImg: string;
      isOnline: boolean;
    };
  };
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  conversation: string;
  createdAt: string;
  message: string;
  updatedAt: string;
  sender: {
    _id: string;
    fullName: string;
    username: string;
    isOnline: boolean;
    profileImg: string;
  };
  _id: string;
  __v: number;
}
