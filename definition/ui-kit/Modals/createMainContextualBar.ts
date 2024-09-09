import {
	IAppAccessors,
	IConfigurationExtend,
	IHttp,
	ILogger,
	IModify,
	IPersistence,
	IRead,
	IUIKitSurfaceViewParam,
} from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import {
	ButtonStyle,
	UIKitSurfaceType,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
	Block,
	TextObjectType,
	ContextBlock,
	SectionBlock,
	LayoutBlock,
	ActionsBlock,
} from '@rocket.chat/ui-kit';
import { IUIKitContextualBarViewParam } from '@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder';
import { INewsletterApp } from '../../../NewsletterApp';
import { ButtonInActionComponent } from './buttonInActionComponent';
import { ButtonInSectionComponent } from './buttonInSectionComponent';
import { selectLLMComponent } from './selectLLMComponent';
import { Modals } from '../../../enum/Modals';
import { inputElementComponent } from './common/inputElementComponent';
import {
	RocketChatAssociationModel,
	RocketChatAssociationRecord,
} from '@rocket.chat/apps-engine/definition/metadata';

export async function createMainContextualBar(
	app: INewsletterApp,
	user: IUser,
	read: IRead,
	persistence: IPersistence,
	modify: IModify,
	room: IRoom,
	viewId?: string
): Promise<IUIKitSurfaceViewParam | Error> {
	const { elementBuilder, blockBuilder } = app.getUtils();
	const blocks: (LayoutBlock | ContextBlock | SectionBlock | ActionsBlock)[] =
		[];

	try {
		// Product Name
		blocks.push(
			inputElementComponent(
				{
					app,
					placeholder: 'Enter product name',
					label: 'Product Name',
					optional: false,
					multiline: false,
					dispatchActionConfigOnInput: true,
					initialValue: '',
				},
				{
					actionId: 'product_name_input',
					blockId: 'product_name_block',
				}
			)
		);

		// New Features
		blocks.push(
			inputElementComponent(
				{
					app,
					placeholder: 'Enter new features',
					label: 'New Features',
					optional: false,
					multiline: true,
					dispatchActionConfigOnInput: true,
					initialValue: '',
				},
				{
					actionId: 'new_features_input',
					blockId: 'new_features_block',
				}
			)
		);

		// Benefits
		blocks.push(
			inputElementComponent(
				{
					app,
					placeholder: 'Enter benefits',
					label: 'Benefits',
					optional: false,
					multiline: true,
					dispatchActionConfigOnInput: true,
					initialValue: '',
				},
				{
					actionId: 'benefits_input',
					blockId: 'benefits_block',
				}
			)
		);

		// FAQ (Optional)
		blocks.push(
			inputElementComponent(
				{
					app,
					placeholder: 'Enter FAQ (optional)',
					label: 'FAQ',
					optional: true,
					multiline: true,
					dispatchActionConfigOnInput: true,
					initialValue: '',
				},
				{
					actionId: 'faq_input',
					blockId: 'faq_block',
				}
			)
		);

		// Additional Info (Optional)
		blocks.push(
			inputElementComponent(
				{
					app,
					placeholder: 'Enter additional info (optional)',
					label: 'Additional Information',
					optional: true,
					multiline: true,
					dispatchActionConfigOnInput: true,
					initialValue: '',
				},
				{
					actionId: 'additional_info_input',
					blockId: 'additional_info_block',
				}
			)
		);

		// Team Name
		blocks.push(
			inputElementComponent(
				{
					app,
					placeholder: 'Enter team name',
					label: 'Team Name',
					optional: false,
					multiline: false,
					dispatchActionConfigOnInput: true,
					initialValue: '',
				},
				{
					actionId: 'team_name_input',
					blockId: 'team_name_block',
				}
			)
		);

		// Style Dropdown
		const styleSelect = this.getUtils().elementBuilder.buildStaticSelectElement(
			{
				placeholder: {
					type: TextObjectType.PLAINTEXT,
					text: 'Select an item',
				},
				options: [
					{
						text: {
							type: TextObjectType.PLAINTEXT,
							text: 'Maintaining Structure',
						},
						value: 'maintaining structure',
					},
					{
						text: {
							type: TextObjectType.PLAINTEXT,
							text: 'Free-form Paragraphs',
						},
						value: 'free-form paragraphs',
					},
				],
				actionId: 'style_select',
			}
		);

		const sectionBlock: SectionBlock = {
			type: 'section',
			text: {
				type: TextObjectType.MRKDWN,
				text: 'Select Style',
			},
			accessory: styleSelect,
		};

		blocks.push(sectionBlock);

		// Generate Button
		blocks.push(
			ButtonInSectionComponent(
				{
					app,
					buttonText: 'Generate Newsletter',
					style: ButtonStyle.PRIMARY,
				},
				{
					actionId: 'generate_newsletter_action',
					blockId: 'generate_newsletter_block',
				}
			)
		);
	} catch (err) {
		console.log('Error in maincontext: ' + err);
		app.getLogger().error(err);
	}

	const close = elementBuilder.addButton(
		{ text: 'Close', style: ButtonStyle.DANGER },
		{
			actionId: 'main_close_action',
			blockId: 'main_close_block',
		}
	);

	return {
		id: viewId || 'newsletterContextualBarId',
		type: UIKitSurfaceType.CONTEXTUAL_BAR,
		title: {
			type: TextObjectType.MRKDWN,
			text: 'Generate Newsletter',
		},
		blocks,
		close,
	};
}
