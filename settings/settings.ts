import {
	ISetting,
	SettingType,
} from '@rocket.chat/apps-engine/definition/settings';
import { AppSettings } from '../types/Const';

export const settings: ISetting[] = [
	{
		id: AppSettings.MODEL_SELECTION,
		i18nLabel: 'Model selection',
		i18nDescription: 'AI model to use for summarization.',
		type: SettingType.SELECT,
		values: [
			{ key: 'llama3-70b', i18nLabel: 'Llama3 70B' },
			{ key: 'mistral-7b', i18nLabel: 'Mistral 7B' },
			{ key: 'llama3-gradient-8b', i18nLabel: 'Llama3 Gradient 8B' },
		],
		required: true,
		public: true,
		packageValue: 'llama3-gradient-8b',
	},
	{
		id: AppSettings.SUMMARY_ADDONS,
		i18nLabel: 'Summary add-ons',
		i18nDescription: 'Additional features to enable for the summary command',
		type: SettingType.MULTI_SELECT,
		values: [
			{ key: 'assigned-tasks', i18nLabel: 'Assigned tasks' },
			{ key: 'follow-up-questions', i18nLabel: 'Follow-up questions' },
		],
		required: false,
		public: true,
		packageValue: '',
	},
];
