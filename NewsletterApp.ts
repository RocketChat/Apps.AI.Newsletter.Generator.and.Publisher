import {
	IAppAccessors,
	IConfigurationExtend,
	ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { NewsletterCommand } from './commands/GenerateCommand';

export class NewsletterApp extends App {
	constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
		super(info, logger, accessors);
	}

	protected async extendConfiguration(
		configuration: IConfigurationExtend
	): Promise<void> {
		await configuration.slashCommands.provideSlashCommand(
			new NewsletterCommand(this)
		);
	}
}
