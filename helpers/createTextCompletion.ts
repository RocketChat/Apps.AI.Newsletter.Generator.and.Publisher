import { IHttp, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { notifyMessage } from './notifyMessage';
import { AppSettings } from '../types/Const';

export async function createTextCompletion(
	room: IRoom,
	read: IRead,
	user: IUser,
	http: IHttp,
	prompt: string,
	threadId?: string
): Promise<string> {
	try {
		const model = await read
			.getEnvironmentReader()
			.getSettings()
			.getValueById(AppSettings.MODEL_SELECTION);

		const url = `http://${model}/v1`;

		const body = {
			model,
			messages: [
				{
					role: 'system',
					content: prompt,
				},
			],
			temperature: 0,
		};

		const response = await http.post(url + '/chat/completions', {
			headers: {
				'Content-Type': 'application/json',
			},
			content: JSON.stringify(body),
		});

		if (!response.content) {
			await notifyMessage(
				room,
				read,
				user,
				'Something is wrong with AI. Please try again later',
				threadId
			);
			throw new Error('Something is wrong with AI. Please try again later');
		}

		return JSON.parse(response.content).choices[0].message.content;
	} catch (error) {
		await notifyMessage(room, read, user, `Error: ${error.message}`, threadId);
		throw error;
	}
}
