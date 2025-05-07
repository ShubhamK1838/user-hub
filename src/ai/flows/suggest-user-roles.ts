'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting user roles based on a job title.
 *
 * - suggestUserRoles - A function that suggests user roles based on a job title.
 * - SuggestUserRolesInput - The input type for the suggestUserRoles function.
 * - SuggestUserRolesOutput - The return type for the suggestUserRoles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestUserRolesInputSchema = z.object({
  jobTitle: z.string().describe('The job title of the user.'),
});
export type SuggestUserRolesInput = z.infer<typeof SuggestUserRolesInputSchema>;

const SuggestUserRolesOutputSchema = z.object({
  suggestedRoles: z
    .array(z.string())
    .describe('An array of suggested roles based on the job title.'),
});
export type SuggestUserRolesOutput = z.infer<typeof SuggestUserRolesOutputSchema>;

export async function suggestUserRoles(input: SuggestUserRolesInput): Promise<SuggestUserRolesOutput> {
  return suggestUserRolesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestUserRolesPrompt',
  input: {schema: SuggestUserRolesInputSchema},
  output: {schema: SuggestUserRolesOutputSchema},
  prompt: `You are an expert in user role management. Based on the job title provided, suggest appropriate user roles.

Job Title: {{{jobTitle}}}

Consider common roles such as ROLE_USER, ROLE_ADMIN, ROLE_MANAGER, ROLE_EDITOR, etc.
Return the suggested roles as a JSON array of strings.
`,
});

const suggestUserRolesFlow = ai.defineFlow(
  {
    name: 'suggestUserRolesFlow',
    inputSchema: SuggestUserRolesInputSchema,
    outputSchema: SuggestUserRolesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
