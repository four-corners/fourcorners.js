export const FC_CORNER_KEYS = [
	'authorship',
	'backstory',
	'imagery',
	'links',
];

export const FC_DEFAULT_DATA = {
	'authorship': {},
	'backstory': {},
	'imagery': {},
	'links': {},
};

export const FC_OPTION_KEYS = [
	'caption',
	'credit',
	'logo',
	'dark',
	'inherit',
];

export const FC_DEFAULT_OPTIONS = {
	caption: false,
	credit: false,
	logo: false,
	dark: false,
	inherit: false,
	verify: false,
	lang: 'en',
};

export const FC_ASSERTION_KEY = 'org.fourcorners.context';

export const FC_STRINGS = {
	en: {
		authorship: 'Authorship',
		backstory: 'Backstory',
		imagery: 'Related Imagery',
		links: 'Links',
		caption: 'Caption',
		credit: 'Credit',
		license: 'License',
		coe: 'Code of ethics',
		bio: 'About the photographer',
		website: 'Website',
		info: 'For more info',
		rights: 'For reproduction rights',
		auth: '& Authentication',
		cert: 'Capture Certificate',
		location: 'Location',
		time: 'Time of capture',
		reg: 'Registration links',
		verify_intro: 'Explore more authenticated data and credentials',
		verify_link: 'here',
	},
	ar: {
		authorship: 'التأليف',
		backstory: 'القصة وراء الصورة ',
		imagery: 'الصور ذات الصلة',
		links: 'الروابط',
		caption: 'Caption',
		credit: 'Credit',
		license: 'الترخيص',
		coe: 'ميثاق أخلاقيات',
		bio: 'السيرة الذاتية',
		website: 'الموقع الكتروني',
		info: 'لمزيد من المعلومات',
		rights: 'للحصول على حقوق النسخ',
	}
};