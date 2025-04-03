# natural-query-language
# 📚 Natural Query Language Agent

A smart AI-powered agent that translates natural language questions into SQL and NoSQL queries for a bookstore database system.

## 🤖 What is it?

This agent acts as your personal database assistant, capable of understanding natural language questions and converting them into proper database queries. It can interact with both PostgreSQL and Redis databases to fetch the information you need.

## ✨ Features

- 🗣️ Natural language processing for database queries
- 🔍 Supports complex PostgreSQL queries for the bookstore database
- ⚡ Redis integration for fast access to frequently used data
- 📊 Handles multiple database schemas (users, books, purchases)
- 🛡️ Safe query execution with parameterized queries

## 🏗️ Architecture

The system uses:
- PostgreSQL for main data storage (users, books, purchases)
- Redis for caching and real-time analytics
- Groq AI model for natural language understanding
- TypeScript/Node.js backend

## 💡 Example Usage

Ask questions like:
- How many users are there in my database?
- What is the email of the top buyer?
