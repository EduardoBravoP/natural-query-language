import { groq } from '@ai-sdk/groq';
import { generateText, tool } from 'ai';
import { Request, Response } from 'express';
import { postgresPrompt, redisPrompt, systemPrompt } from '../utils/prompts';
import { z } from 'zod';
import { AppDataSource } from '../config/database';
import { redisClient } from '../config/redis';

export const getData = async (req: Request, res: Response) => {
  const { question } = req.body;

  const result = await generateText({
    model: groq("qwen-qwq-32b"),
    prompt: question,
    system: systemPrompt,
    tools: {
      executePostgresQuery: tool({
        description: postgresPrompt,
        execute: async ({ query, parameters }) => {
          console.log('query', query)
          console.log('parameters', parameters)

          const result = await AppDataSource.query(query, parameters);
          return JSON.stringify(result);
        },
        parameters: z.object({
          query: z.string().describe("Query SQL a ser executado"),
          parameters: z.array(z.string()).describe("Parametros a ser executados")
        })
      }),
      executeRedisCommand: tool({
        description: redisPrompt,
        execute: async ({ command, args }) => {
          console.log('command', command)

          const result = await redisClient.call(command, args);
          return JSON.stringify(result);
        },
        parameters: z.object({
          command: z.string().describe("Comando do Redis a ser executado"),
          args: z.array(z.string()).describe("Os argumentos passados depois do comando Redis")
        })
      })
    },
    maxSteps: 5
  });

  console.log('result', result)

  res.json({ answer: result.text })
}