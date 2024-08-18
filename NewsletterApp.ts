import {
	IAppAccessors,
	IConfigurationExtend,
	ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { ElementBuilder } from './lib/ElementBuilder';
import { BlockBuilder } from './lib/BlockBuilder';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { NewsletterCommand } from './commands/GenerateCommand';
import { settings } from './settings/settings';

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
		this.elementBuilder = new ElementBuilder(this.getID());
		this.blockBuilder = new BlockBuilder(this.getID());
	}

	public getUtils() {
		return {
			elementBuilder: this.elementBuilder,
			blockBuilder: this.blockBuilder,
		};
	}

	public async extendConfiguration(configuration: IConfigurationExtend) {
		await Promise.all([
			...settings.map((setting) =>
				configuration.settings.provideSetting(setting)
			),
			configuration.slashCommands.provideSlashCommand(
				new NewsletterCommand(this)
			),
		]);
	}
}
