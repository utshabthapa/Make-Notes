CREATE DATABASE make_notes;
USE make_notes;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE note_categories (
  note_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (note_id, category_id),
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Run these commands in MySQL Workbench
ALTER TABLE notes 
ADD COLUMN deleted_at TIMESTAMP NULL;

ALTER TABLE notes ADD COLUMN background_color VARCHAR(7) DEFAULT '#ffffff';

ALTER TABLE categories ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE categories ADD COLUMN deleted_at TIMESTAMP NULL;
ALTER TABLE categories ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE categories ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Add pinned and bookmarked columns to notes table
ALTER TABLE notes ADD COLUMN pinned BOOLEAN DEFAULT FALSE;
ALTER TABLE notes ADD COLUMN bookmarked BOOLEAN DEFAULT FALSE;

-- Add indexes for better performance on pinned and bookmarked queries
CREATE INDEX idx_notes_pinned ON notes(pinned, user_id);
CREATE INDEX idx_notes_bookmarked ON notes(bookmarked, user_id);
