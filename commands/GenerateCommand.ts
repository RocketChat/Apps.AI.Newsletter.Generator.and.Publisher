import {
	IHttp,
	IModify,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
	ISlashCommand,
	SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';
import { notifyMessage } from '../helpers/notifyMessage';
import { createTextCompletion } from '../helpers/createTextCompletion';
import { createNewsletterPrompt } from '../constants/prompts';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { NewsletterInput, NewsletterStyle } from '../types/NewsletterInput';

export class GenerateCommand implements ISlashCommand {
	public command = 'generate';
	public i18nParamsExample =
		'Generate a newsletter: product_name: "Product Name" | new_features: "Feature 1, Feature 2" | benefits: "Benefit 1, Benefit 2" | faq: "Question 1?, Question 2?" | additional_info: "Info" | team_name: "Team Name" | style: "free-form paragraphs"';
	public i18nDescription = 'Generates a newsletter based on the provided input';
	public providesPreview = false;
	private readonly app: App;

	constructor(app: App) {
		this.app = app;
	}

	public async executor(
		context: SlashCommandContext,
		read: IRead,
		modify: IModify,
		http: IHttp
	): Promise<void> {
		const user = context.getSender();
		const room = context.getRoom();
		const userInput = context.getArguments().join(' ');

		if (!userInput) {
			await notifyMessage(
				room,
				read,
				user,
				'Please provide content for the newsletter. Usage: /generate product_name: "Product Name" | new_features: "Feature 1, Feature 2" | ...'
			);
			return;
		}

		await notifyMessage(room, read, user, 'Generating your newsletter...');

		const newsletterInput: NewsletterInput = this.parseUserInput(userInput);

		const prompt = createNewsletterPrompt(newsletterInput);
		const newsletter = await createTextCompletion(
			this.app,
			room,
			read,
			user,
			http,
			prompt
		);

		await notifyMessage(room, read, user, newsletter);
	}

	private parseUserInput(userInput: string): NewsletterInput {
		const parts = userInput.split('|').map((part) => part.trim());
		const input: Partial<NewsletterInput> = {};

		for (const part of parts) {
			const [key, value] = part.split(':').map((item) => item.trim());
			if (key && value) {
				if (key === 'style') {
					(input as any)[key] = this.parseStyle(value);
				} else {
					(input as any)[key] = value.replace(/^"(.*)"$/, '$1');
				}
			}
		}

		return {
			product_name: input.product_name || 'Default Product',
			new_features: input.new_features || '',
			benefits: input.benefits || '',
			faq: input.faq || '',
			additional_info: input.additional_info || '',
			team_name: input.team_name || 'Our Team',
			style: input.style || NewsletterStyle.FreeFormParagraphs,
		};
	}

	private parseStyle(style: string): NewsletterStyle {
		if (style.toLowerCase() === 'maintaining structure') {
			return NewsletterStyle.MaintainingStructure;
		}
		return NewsletterStyle.FreeFormParagraphs;
	}
}
