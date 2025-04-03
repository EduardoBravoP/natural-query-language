import { Request, Response } from 'express';
import { groq } from '@ai-sdk/groq';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import { AppDataSource } from '../config/database';
import { postgresPrompt, redisPrompt, systemPrompt } from '../utils/prompts';
import { redisClient } from '../config/redis';

export const getData = async (req: Request, res: Response) => {
  const { question } = req.body;

  const result = await generateText({
    model: groq('qwen-qwq-32b'),
    prompt: question,
    tools: {
      executePostgresQuery: tool({
        description: postgresPrompt,
        parameters: z.object({
          query: z.string().describe('A query SQL a ser executada no banco de dados')
        }),
        execute: async ({ query }) => {
          const result = await AppDataSource.query(query);
          return JSON.stringify(result);
        },
      }),
      executeRedisQuery: tool({
        description: redisPrompt,
        parameters: z.object({
          query: z.string().describe('O comando Redis a ser executado')
        }),
        execute: async ({ query }) => {
          const result = await redisClient.call(query);
          return JSON.stringify(result);
        },
      })
    },
    system: systemPrompt,
    maxSteps: 5
  });
  
  return res.status(200).json({ answer: result.text });
};