
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting user roles based on a job title.
 *
 * - suggestUserRoles - A function that suggests user roles based on a job title. (Now an API wrapper)
 * - SuggestUserRolesInput - The input type for the suggestUserRoles function.
 * - SuggestUserRolesOutput - The return type for the suggestUserRoles function.
 */

// import {ai} from '@/ai/genkit'; // No longer needed if API handles Genkit interaction
import { suggestUserRolesApi } from '@/lib/api-client';
import {z} from 'genkit'; // z can still be used for schema definition on client if needed

// Schemas can remain for type safety if client constructs the object
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


// This function now calls the API endpoint
export async function suggestUserRoles(input: SuggestUserRolesInput): Promise<SuggestUserRolesOutput> {
  try {
    // The API client function `suggestUserRolesApi` handles the actual call to the backend
    // which in turn calls the Genkit flow.
    const response = await suggestUserRolesApi(input);
    return response; // The API client should return data conforming to SuggestUserRolesOutput
  } catch (error: any) {
    console.error("Error calling suggestUserRoles API:", error);
    // Propagate a structured error or a default error response
    throw new Error(error.message || "Failed to suggest user roles via API.");
  }
}

// The Genkit prompt and flow definitions below are now assumed to be on the backend,
// invoked by the /api/ai/suggest-roles endpoint.
// They are kept here for reference but would not be directly executed by the client.

/*
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
*/
