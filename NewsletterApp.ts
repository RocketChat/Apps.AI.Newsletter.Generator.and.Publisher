import {
	IUIKitResponse,
	UIKitBlockInteractionContext,
	UIKitSurfaceType,
	IUIKitSurface,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
	IHttp,
	IModify,
	IPersistence,
	IRead,
	IAppAccessors,
	IConfigurationExtend,
	ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
	RocketChatAssociationModel,
	RocketChatAssociationRecord,
	IAppInfo,
} from '@rocket.chat/apps-engine/definition/metadata';
import { createNewsletterPrompt } from './constants/prompts';
import { NewsletterInput, NewsletterStyle } from './types/NewsletterInput';
import { ElementBuilder } from './lib/ElementBuilder';
import { BlockBuilder } from './lib/BlockBuilder';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { NewsletterCommand } from './commands/GenerateCommand';
import { settings } from './settings/settings';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { createTextCompletion } from './helpers/createTextCompletion';

export interface INewsletterApp extends App {
	getUtils: () => {
		elementBuilder: ElementBuilder;
		blockBuilder: BlockBuilder;
	};
}

export class NewsletterApp extends App implements INewsletterApp {
	private elementBuilder: ElementBuilder;
	private blockBuilder: BlockBuilder;

	constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
		super(info, logger, accessors);
	}

	public getUtils() {
		return {
			elementBuilder: this.elementBuilder,
			blockBuilder: this.blockBuilder,
		};
	}

	public async extendConfiguration(configuration: IConfigurationExtend) {
		this.elementBuilder = new ElementBuilder(this.getID());
		this.blockBuilder = new BlockBuilder(this.getID());

		await Promise.all([
			...settings.map((setting) =>
				configuration.settings.provideSetting(setting)
			),
			configuration.slashCommands.provideSlashCommand(
				new NewsletterCommand(this)
			),
		]);
	}

	public async executeBlockActionHandler(
		context: UIKitBlockInteractionContext,
		read: IRead,
		http: IHttp,
		persistence: IPersistence,
		modify: IModify
	): Promise<IUIKitResponse> {
		const { actionId } = context.getInteractionData();

		switch (actionId) {
			case 'generate_newsletter_action':
				return this.handleGenerateNewsletter(
					context,
					read,
					http,
					persistence,
					modify
				);
			case 'main_close_action':
				return this.handleCloseModal(context, modify);
			case 'product_name_input':
			case 'new_features_input':
			case 'benefits_input':
			case 'faq_input':
			case 'additional_info_input':
			case 'team_name_input':
			case 'style_select':
				await this.saveInputData(context, persistence);
				return context.getInteractionResponder().successResponse();
			default:
				break;
		}

		return context.getInteractionResponder().successResponse();
	}

	private async saveInputData(
		context: UIKitBlockInteractionContext,
		persistence: IPersistence
	): Promise<void> {
		const { container, actionId, value } = context.getInteractionData();

		const association = new RocketChatAssociationRecord(
			RocketChatAssociationModel.MISC,
			`newsletter_data_${container.id}`
		);

		let currentData: NewsletterInput = {
			product_name: '',
			new_features: '',
			benefits: '',
			faq: '',
			additional_info: '',
			team_name: '',
			style: NewsletterStyle.FreeFormParagraphs,
		};

		switch (actionId) {
			case 'product_name_input':
				currentData.product_name = value as string;
				break;
			case 'new_features_input':
				currentData.new_features = value as string;
				break;
			case 'benefits_input':
				currentData.benefits = value as string;
				break;
			case 'faq_input':
				currentData.faq = value as string;
				break;
			case 'additional_info_input':
				currentData.additional_info = value as string;
				break;
			case 'team_name_input':
				currentData.team_name = value as string;
				break;
			case 'style_select':
				currentData.style = value as NewsletterStyle;
				break;
		}

		await persistence.updateByAssociation(association, currentData, true);
	}
	private async handleGenerateNewsletter(
		context: UIKitBlockInteractionContext,
		read: IRead,
		http: IHttp,
		persistence: IPersistence,
		modify: IModify
	): Promise<IUIKitResponse> {
		const { user, container } = context.getInteractionData();
		const room = context.getInteractionData().room;

		if (!room) {
			await this.notifyUser(
				user,
				modify,
				'Error: Unable to determine the current room.'
			);
			return context.getInteractionResponder().errorResponse();
		}

		try {
			const association = new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				`newsletter_data_${container.id}`
			);
			const persistenceReader = read.getPersistenceReader();
			const data = (await persistenceReader.readByAssociation(
				association
			)) as NewsletterInput[];

			if (!data || data.length === 0) {
				throw new Error('No newsletter data found');
			}

			const newsletterData = data[0];
			const prompt = createNewsletterPrompt(newsletterData);

			await this.notifyUser(
				user,
				modify,
				'Generating newsletter... This may take a moment.'
			);

			const newsletter = await createTextCompletion(
				room,
				read,
				user,
				http,
				prompt
			);

			await this.notifyUser(user, modify, newsletter);

			return context.getInteractionResponder().successResponse();
		} catch (error) {
			await this.notifyUser(
				user,
				modify,
				`Error generating newsletter: ${error.message}`
			);
			return context.getInteractionResponder().errorResponse();
		}
	}

	private async handleCloseModal(
		context: UIKitBlockInteractionContext,
		modify: IModify
	): Promise<IUIKitResponse> {
		const interactionData = context.getInteractionData();
		const user = interactionData.user;
		const surfaceId = interactionData.container.id;

		const view: IUIKitSurface = {
			appId: this.getID(),
			id: surfaceId,
			type: UIKitSurfaceType.CONTEXTUAL_BAR,
			title: {
				type: 'plain_text',
				text: 'Newsletter Generator',
			},
			blocks: [],
		};

		await modify
			.getUiController()
			.updateSurfaceView(view, { triggerId: interactionData.triggerId }, user);

		return context.getInteractionResponder().successResponse();
	}

	private async notifyUser(
		user: IUser,
		modify: IModify,
		message: string
	): Promise<void> {
		const notifier = modify.getNotifier();
		const messageBuilder = modify
			.getCreator()
			.startMessage()
			.setText(message)
			.setSender(user);
		await notifier.notifyUser(user, messageBuilder.getMessage());
	}
}
