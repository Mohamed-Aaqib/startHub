
type User = {
    _id: string;
    name: string;
  };
  
  type Message = {
    _id: string;
    chatId: string;
    sender: string; // user _id
    type: "text" | "media";
    content?: string;
    media?: {
      url: string;
      type: "image" | "video" | "audio" | "file";
      metadata: Record<string, any>;
    };
    createdAt: string;
  };
  
  type Chat = {
    _id: string;
    type: "direct" | "group" | "startup";
    name: string | null;
    members: string[]; // array of user _ids
    lastMessageAt: string;
    groupAdmin: string | null;
    createdBy: string;
    avatarUrl: string | null;
    messages: Message[];
  };
  
  type SocialData = {
    users: User[];
    chats: Chat[];
  };  

export const SOCIAL_DATA:SocialData  = {
    "users": [
      { "_id": "64f8a1d2c9f3b2a1b1234567", "name": "Alice" },
      { "_id": "64f8a1d2c9f3b2a1b1234568", "name": "Bob" },
      { "_id": "64f8a1d2c9f3b2a1b1234569", "name": "Charlie" },
      { "_id": "64f8a1d2c9f3b2a1b1234570", "name": "Diana" }
    ],
  
    "chats": [
      {
        "_id": "7501abcd1234567890abcdef",
        "type": "direct",
        "name": null,
        "members": ["64f8a1d2c9f3b2a1b1234567", "64f8a1d2c9f3b2a1b1234568"],
        "lastMessageAt": "2025-08-19T20:15:00Z",
        "groupAdmin": null,
        "createdBy": "64f8a1d2c9f3b2a1b1234567",
        "avatarUrl": null,
        "messages": [
          {
            "_id": "a101",
            "chatId": "7501abcd1234567890abcdef",
            "sender": "64f8a1d2c9f3b2a1b1234567",
            "type": "text",
            "content": "Hey Bob, how’s everything?",
            "createdAt": "2025-08-19T19:00:00Z"
          },
          {
            "_id": "a102",
            "chatId": "7501abcd1234567890abcdef",
            "sender": "64f8a1d2c9f3b2a1b1234568",
            "type": "text",
            "content": "All good Alice! Just working on the project 🚀",
            "createdAt": "2025-08-19T19:02:00Z"
          }
        ]
      },
  
      {
        "_id": "7502abcd1234567890abcdef",
        "type": "group",
        "name": "Weekend Plans",
        "members": [
          "64f8a1d2c9f3b2a1b1234567",
          "64f8a1d2c9f3b2a1b1234568",
          "64f8a1d2c9f3b2a1b1234569"
        ],
        "lastMessageAt": "2025-08-19T20:30:00Z",
        "groupAdmin": "64f8a1d2c9f3b2a1b1234567",
        "createdBy": "64f8a1d2c9f3b2a1b1234567",
        "avatarUrl": "https://dummyimage.com/100x100/ffcc00/000.png&text=Group",
        "messages": [
          {
            "_id": "b201",
            "chatId": "7502abcd1234567890abcdef",
            "sender": "64f8a1d2c9f3b2a1b1234569",
            "type": "text",
            "content": "So, where are we going this weekend?",
            "createdAt": "2025-08-19T19:10:00Z"
          },
          {
            "_id": "b201",
            "chatId": "7502abcd1234567890abcdef",
            "sender": "64f8a1d2c9f3b2a1b1234569",
            "type": "text",
            "content": "Im ready to spend some quality time with all of you!",
            "createdAt": "2025-08-19T19:10:00Z"
          },
          {
            "_id": "b202",
            "chatId": "7502abcd1234567890abcdef",
            "sender": "64f8a1d2c9f3b2a1b1234567",
            "type": "text",
            "content": "How about a road trip to Fujairah?",
            "createdAt": "2025-08-19T19:15:00Z"
          },
          {
            "_id": "b203",
            "chatId": "7502abcd1234567890abcdef",
            "sender": "64f8a1d2c9f3b2a1b1234568",
            "type": "media",
            "media": {
              "url": "https://dummyimage.com/600x400/00ffcc/000.png&text=Beach",
              "type": "image",
              "metadata": { "caption": "Beach spot idea" }
            },
            "createdAt": "2025-08-19T19:20:00Z"
          },
          {
            "_id": "b202",
            "chatId": "7502abcd1234567890abcdef",
            "sender": "64f8a1d2c9f3b2a1b1234567",
            "type": "text",
            "content": "Ok that looks good im in, what about you guys?",
            "createdAt": "2025-08-19T19:15:00Z"
          },
        ]
      },
  
      {
        "_id": "7503abcd1234567890abcdef",
        "type": "startup",
        "name": "AI Project Team",
        "members": [
          "64f8a1d2c9f3b2a1b1234567",
          "64f8a1d2c9f3b2a1b1234568",
          "64f8a1d2c9f3b2a1b1234569",
          "64f8a1d2c9f3b2a1b1234570"
        ],
        "lastMessageAt": "2025-08-19T21:00:00Z",
        "groupAdmin": "64f8a1d2c9f3b2a1b1234567",
        "createdBy": "64f8a1d2c9f3b2a1b1234567",
        "avatarUrl": "https://dummyimage.com/100x100/ff6600/fff.png&text=Startup",
        "messages": [
          {
            "_id": "c301",
            "chatId": "7503abcd1234567890abcdef",
            "sender": "64f8a1d2c9f3b2a1b1234570",
            "type": "text",
            "content": "Guys, I finished the backend API for user auth 🎉",
            "createdAt": "2025-08-19T20:00:00Z"
          },
          {
            "_id": "c302",
            "chatId": "7503abcd1234567890abcdef",
            "sender": "64f8a1d2c9f3b2a1b1234568",
            "type": "media",
            "media": {
              "url": "https://dummyfiles.com/design-doc.pdf",
              "type": "file",
              "metadata": { "filename": "design-doc.pdf", "sizeKB": 420 }
            },
            "createdAt": "2025-08-19T20:20:00Z"
          },
          {
            "_id": "c303",
            "chatId": "7503abcd1234567890abcdef",
            "sender": "64f8a1d2c9f3b2a1b1234569",
            "type": "text",
            "content": "Awesome! I’ll hook it up with the frontend now 🔗",
            "createdAt": "2025-08-19T20:30:00Z"
          }
        ]
      }
    ]
  }  