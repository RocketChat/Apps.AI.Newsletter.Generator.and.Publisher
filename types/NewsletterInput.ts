export enum NewsletterStyle {
	MaintainingStructure = 'maintaining structure',
	FreeFormParagraphs = 'free-form paragraphs',
}

export interface NewsletterInput {
	product_name: string;
	new_features: string;
	benefits: string;
	faq: string;
	additional_info: string;
	team_name: string;
	style: NewsletterStyle;
}
