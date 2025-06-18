# Efficient Real-Time Chat Application Using Data Structures and Algorithms

A real-time chat app built using **React Native** and a custom **Redix backend**, focused on implementing core Data Structures and Algorithms (DAA) for performance, scalability, and security.

---

## 🚀 Features

- **User Authentication** via Hash Tables
- **Real-time Messaging** through Queues
- **AES/RSA Encryption** for secure communication
- **Trie/KMP** for fast message search
- **Message Storage** using Linked Lists / BST
- Built on a **modular DSA-based architecture**

---

## 🧠 DSA Concepts Used

| Feature              | Algorithm / DS         | Time Complexity       |
|---------------------|------------------------|------------------------|
| Auth                | Hash Table             | O(1)                  |
| Encrypt/Decrypt     | AES (symmetric)        | O(n)                  |
| Key Exchange        | RSA (asymmetric)       | O(k³)                 |
| Messaging Flow      | Queue                  | O(1)                  |
| Search Messages     | Trie / KMP             | O(L) / O(N + M)       |
| Store Messages      | Linked List / BST      | O(1) / O(log n)       |

---

## 🛠️ Tech Stack

- **Frontend**: React Native
- **Backend**: Redix (custom backend, possibly with Redis)
- **Encryption**: AES for messages, RSA for key exchange
- **State Management**: Redux (optional, for app state)

---

## 🔐 Encryption Flow

1. User A generates an AES key
2. Encrypts AES key using B’s RSA public key
3. Encrypts the message using AES
4. Sends both to B
5. B decrypts AES key with RSA private key, then decrypts the message with AES

---