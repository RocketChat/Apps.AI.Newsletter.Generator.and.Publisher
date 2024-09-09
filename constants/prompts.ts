import { NewsletterInput } from '../types/NewsletterInput';

const NEWSLETTER_PROMPT = `
{
  "task": "You are a marketing expert who needs to create an engaging product release newsletter. Your goal is to introduce the [product_name] and highlight its unique features and benefits to potential customers.",
  "instructions": [
    {
      "section": "Introduction",
      "input": {
        "product_name": "[product_name]"
      },
      "desired_output": "Write an attention-grabbing introduction that emphasizes the innovative nature of [product_name]. Mention the product name and provide a brief overview of its key features.",
      "length": "3-4 sentences"
    },
    {
      "section": "Features and Benefits",
      "input": {
        "new_features": "[new_features]",
        "benefits": "[benefits]",
        "style": "[style]"
      },
      "desired_output": "Discuss the features and benefits of the product listed in the 'new_features' and 'benefits' sections in a holistic manner, focusing on how the product as a whole solves user problems and enhances their experience. If 'style' is 'maintaining structure', use the provided subtitles and itemization, starting each item with a number (1, 2, 3). If 'style' is 'free-form paragraphs', merge all the features and benefits into a flowing, conversational style spanning some paragraphs with autonomously generated creative, engaging, and eye-catching subtitles that will draw the reader in. Explain how the features work together synergistically to provide a seamless user experience. Use relatable examples to illustrate the benefits.",
      "style": "[style]"
    },
    {
      "section": "FAQ",
      "input": {
        "faq": "[faq]",
        "style": "[style]"
      },
      "desired_output": "Present the frequently asked questions about the product listed in the 'faq' section. If 'style' is 'maintaining structure', format each question as 'Q: [Question]' and its answer as 'A: [Answer]', starting each pair with a number (1, 2, 3). If 'style' is 'free-form paragraphs', generate a creative, engaging, and eye-catching subtitle for this section that will make the reader want to learn more. Present the questions and answers in a conversational, relatable manner, using appropriate transitions and connective phrases to create a natural flow. Provide clear and concise answers to each question.",
      "length": "1-3 sentences per answer",
      "style": "[style]"
    },
    {
      "section": "Additional Information",
      "input": {
        "additional_info": "[additional_info]",
        "style": "[style]"
      },
      "desired_output": "Provide the additional information about the product listed in the 'additional_info' section, including URLs, email addresses, and phone numbers. If 'style' is 'maintaining structure', use the default 'Additional Information' subtitle. If 'style' is 'free-form paragraphs', generate a creative, engaging, and eye-catching subtitle for this section that encourages the reader to seek further assistance.",
      "length": "1-2 sentences per information item",
      "style": "[style]"
    },
    {
      "section": "Conclusion",
      "input": {
        "product_name": "[product_name]",
        "team_name": "[team_name]",
        "style": "[style]"
      },
      "desired_output": "Conclude the article with a strong call-to-action, encouraging readers to try [product_name]. Reiterate the key benefits and create a sense of urgency. If 'style' is 'free-form paragraphs', generate a creative, engaging, and eye-catching subtitle for this section that will make the reader want to take action. End the article with 'Sincerely, [team_name]'.",
      "length": "3-4 sentences",
      "style": "[style]"
    }
  ],
  "create_article": [
    "Combine the Introduction, Features and Benefits, FAQ, Additional Information, and Conclusion into an engaging newsletter.",
    "Use clear paragraph breaks to separate sections and improve readability.",
    "Generate creative, engaging, and eye-catching subtitles for each section that will draw the reader in and make them want to learn more.",
    "Present the content in a conversational, relatable manner, using appropriate transitions and connective phrases to create a natural flow.",
    "Include all sections in the output: Introduction, Features and Benefits, FAQ, Additional Information, and Conclusion.",
    "Ensure that the generated subtitles are wrapped in double asterisks (**) for markdown formatting.",
    "The FAQ section is required and must include the provided questions and their corresponding answers.",
    "The output should be the newsletter content only, without any generational comments or explanations."
  ]
}
`;

export function createNewsletterPrompt(input: NewsletterInput): string {
	let prompt = NEWSLETTER_PROMPT;
	for (const [key, value] of Object.entries(input)) {
		const regex = new RegExp(`\\[${key}\\]`, 'g');
		prompt = prompt.replace(regex, value.toString());
	}
	return prompt;
}
