# Problem Statement

## **Idea**

A **wellness journal app** where users capture their feelings and experiences through short snippets throughout the day. Instead of forcing daily long entries, the app supports flexible, in-the-moment journaling with GenAI features to summarize, analyze, and reflect over time.

## **What is the main functionality?**

The app allows users to log short snippets of their day, which are then aggregated into a daily journal entry. It also provides insights into emotional trends and allows users to search through their past entries using natural language queries.

## **Who are the intended users?**

Everyone, particularly younger individuals, who find it challenging to express or comprehend their emotions and find "traditional" journaling cumbersome. In today's fast-paced world filled with constant distractions, it can be difficult to carve out time and energy for self-reflection and staying in touch with one's emotions.

## **How will you integrate GenAI meaningfully?**

The app will leverage GenAI in the following ways:

- Summarize all journal snippets made throughout a day into a coherent daily entry
- Long-term reflection by querying past entries (e.g. "What have I learned this month?") through semantic search over a vector database of past snippets
- Behavioral insight generation (e.g. "I feel anxious when I have too many tasks") using LLMs to analyze the user's mood and suggest patterns

## **Describe some scenarios in which your app will function.**

- **Quick Snippet Logging**: You just had a tense conversation and want to log it. You open the web app, type 2-3 sentences. It's stored and timestamped.
- **Daily Reflection**: Throughout the day, you can add snippets and reflect on your mood and experiences. The app aggregates these into a daily summary.
- **Mood Calendar**: You check the weekly overview and notice a pattern of low moods on certain days
- **Self-Coaching**: You can analyze with the help of the LLM your recent entries and suggests patterns.
