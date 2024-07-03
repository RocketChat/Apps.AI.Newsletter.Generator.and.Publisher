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

const SUMMARY_PROMPT = `Summarize the following dialogue using 1-3 short and simple sentences. Use as fewer words as possible. Mention the names of specific persons.

Dialogue: ###
Tim: Hi, what's up? Kim: Bad mood tbh, I was going to do lots of stuff but ended up procrastinating Tim: What did you plan on doing? Kim: Oh you know, uni stuff and unfucking my room Kim: Maybe tomorrow I'll move my ass and do everything Kim: We were going to defrost a fridge so instead of shopping I'll eat some defrosted veggies Tim: For doing stuff I recommend Pomodoro technique where u use breaks for doing chores Tim: It really helps Kim: thanks, maybe I'll do that Tim: I also like using post-its in kaban style
###

Summary: Kim may try the pomodoro technique recommended by Tim to get more stuff done.

---

Summarize the following dialogue using 1-3 short and simple sentences. Use as fewer words as possible. Mention the names of specific persons.

Dialogue: ###
John: Ave. Was there any homework for tomorrow? Cassandra: hello :D Of course, as always :D John: What exactly? Cassandra: I'm not sure so I'll check it for you in 20minutes. John: Cool, thanks. Sorry I couldn't be there, but I was busy as fuck...my stupid boss as always was trying to piss me off Cassandra: No problem, what did he do this time? John: Nothing special, just the same as always, treating us like children, commanding to do this and that... Cassandra: sorry to hear that. but why don't you just go to your chief and tell him everything? John: I would, but I don't have any support from others, they are like goddamn pupets and pretend that everything's fine...I'm not gonna fix everything for everyone Cassandra: I understand...Nevertheless, just try to ignore him. I know it might sound ridiculous as fuck, but sometimes there's nothing more you can do. John: yeah I know...maybe some beer this week? Cassandra: Sure, but I got some time after classes only...this week is gonna be busy John: no problem, I can drive you home and we can go to some bar or whatever. Cassandra: cool. ok, I got this homework. it's page 15 ex. 2 and 3, I also asked the others to study another chapter, especially the vocabulary from the very first pages. Just read it. John: gosh...I don't know if I'm smart enough to do it :'D Cassandra: you are, don't worry :P Just circle all the words you don't know and we'll continue on Monday. John: ok...then I'll try my best :D Cassandra: sure, if you will have any questions just either text or call me and I'll help you. John: I hope I won't have to waste your time xD Cassandra: you're not wasting my time, I'm your teacher, I'm here to help. This is what I get money for, also :P John: just kidding :D ok, so i guess we'll stay in touch then Cassandra: sure, have a nice evening :D John: you too, se ya Cassandra: Byeeeee
###

Summary: John didn't show up for class due to some work issues with his boss. Cassandra, his teacher told him which exercises to do, and which chapter to study. They are going to meet up for a beer sometime this week after class.

---

Summarize the following dialogue using 1-3 short and simple sentences. Use as fewer words as possible. Mention the names of specific persons.

Dialogue: ###
Leon: did you find the job yet? Arthur: no bro, still unemployed :D Leon: hahaha, LIVING LIFE Arthur: i love it, waking up at noon, watching sports - what else could a man want? Leon: a paycheck? ;) Arthur: don't be mean... Leon: but seriously, my mate has an offer as a junior project manager at his company, are you interested? Arthur: sure thing, do you have any details? Leon: <file_photo> Arthur: that actually looks nice, should I reach out directly to your friend or just apply to this email address from the screenshot? Leon: it's his email, you can send your resume directly and I will mention to him who you are :)
###

Summary: Arthur is still unemployed. Leon sends him a job offer for junior project manager position. Arthur is interested.

---

Summarize the following dialogue. Mention the names of specific persons. Only give the summary, nothing else.

Dialogue: ###
{dialogue}
###

Summary: `;

export function createSummaryPrompt(dialogue: string): string {
	return SUMMARY_PROMPT.replace('{dialogue}', dialogue);
}

const ASSIGNED_TASKS_PROMPT = `
Analyze the following dialogue to identify any assigned tasks. An assigned task is typically indicated by phrases where one person delegates an action to another person or team, often specifying what needs to be done and by whom. Highlight these assigned tasks, including any relevant details such as deadlines or specific instructions.

Your task is to extract and present the assigned tasks clearly. For each assigned task, provide the following details:
Task Title
- Description
- Assignee
- Deadline (if mentioned)

Strictly follow the output format and output nothing else.
Only output assigned tasks if mentioned obviously in the dialogue. Be strict. If no obvious assign tasks are mentioned, simply output "No assigned task mentioned" and nothing else.

Dialogue to analyze:
{dialogue}
`;

export function createAssignedTasksPrompt(dialogue: string): string {
	return ASSIGNED_TASKS_PROMPT.replace('{dialogue}', dialogue);
}

const FOLLOW_UP_QUESTIONS_PROMPT = `
Analyze the following dialogue and suggest 1-3 follow-up questions that would help clarify or expand on the topics discussed. Use bullet points.

The output format should be as follows:
Suggested follow-up questions:
- Question 1
- Question 2
- Question 3

Strictly follow the output format and output nothing else.

Tips on follow-up questions:
- Obtain additional information or details.
- Clarify any ambiguous statements or instructions.
- Explore related ideas or implications.
- Address any unanswered questions or unresolved issues.

Dialogue to analyze:
{dialogue}
`;

export function createFollowUpQuestionsPrompt(dialogue: string): string {
	return FOLLOW_UP_QUESTIONS_PROMPT.replace('{dialogue}', dialogue);
}
