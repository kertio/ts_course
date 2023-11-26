/**
 * Напишите функцию, которая отправляет запрос на 
 * https://dummyjson.com/users
 * для получения пользователей и вывода части их данных в консль.
 * Так же нужно:
 * 		- Обработать ошибку исключения
 * 		- использовать enum
*/
// import chalk from 'chalk';
const chalk = require('chalk');

type TEmail = string;
type TPhone = string;
type TUrl = string;
type TIp = string;

enum GENDER {
	male = 'male',
	female = 'female'
}

interface ICoordinates {
	lat: number;
	lng: number;
}

interface IAddress {
	address: string
	city: string;
	coordinates: ICoordinates;
  postalCode: string,
	state: string;
}

interface ICompany {
	address: IAddress;
	department: string;
	name: string;
	title: string;
}

interface IHair {
	color: string	;
	type: string;
}

interface IBank {
	cardExpire: Date | string;
	cardNumber: string;
	cardType: string;
	currency: string;
	iban: string;
}

interface IUser {
	id: number;
	firstName: string;
	lastName: string;
	maidenName: string;
	age: number;
	gender: GENDER | null;
	email: TEmail;
	phone: TPhone;
	username: string;
	password: string;
	birthDate: Date;
  image: TUrl
	bloodGroup: string;
  height: number,
  weight: number,
  eyeColor: string,
  hair: IHair,
  domain: TUrl,
	ip: TIp,
	address: IAddress;
	macAddress: string;
	university: string;
	bank: IBank;
	company: ICompany;
	ein: string;
	ssn: string;
	userAgent: string;
}


function isGender(g: string): g is GENDER {
	if (GENDER[g as GENDER] !== undefined) {
		return true;
	} else { 
		throw new Error(`${g} не относится к типу GENDER`);
	}
}

/**
 * 
 * @param rawJSONasString JSON stringified object
 * @returns array of IUser object
 */
function convertRawToUser(rawJSONasString: string): IUser[] {
	let user: IUser[] = [];
	const rawObj = JSON.parse(rawJSONasString)?.users;

	if (!rawObj) throw new Error('Нет данных для обработки');

	for (const el of rawObj) {
		user.push({
			id: el.id as number,
			firstName: el.firstName as string,
			lastName: el.lastName as string,
			maidenName: el.maidenName as string,
			age: el.age as number,
			gender: isGender(el.gender) ? GENDER[el.gender as GENDER] : null,
			email: el.email as TEmail,
			phone: el.phone as TPhone,
			username: el.username as string,
      password: el.password as string,
      birthDate: el.birthDate as Date,
      image: el.image as TUrl,
      bloodGroup: el.bloodGroup as string,
      height: el.height as number,
			weight: el.weight as number,
      eyeColor: el.eyeColor as string,
      hair: el.hair as IHair,
      domain: el.domain as TUrl,
			ip: el.ip as TIp,
			address: el.address as IAddress,
			macAddress: el.macAddress as string,
			university: el.university as string,
			bank: el.bank as IBank,
			company: el.company as ICompany,
			ein: el.ein as string,
			ssn: el.ssn as string,
			userAgent: el.userAgent as string
		} as IUser)
	}

	return user;
}

function printUserInfo(user: IUser) {
	console.log(chalk.bold(user.id),
		chalk.grey(user.firstName),
		chalk.underline(user.email),
		user.address,
	);
}

async function __main(url: TUrl): Promise<IUser []> {
	const resp = await fetch(url);
	if (!resp.ok) {
		throw new Error('Ошибка получения данных');
	}
	
	const rawData: string = await resp.json();
	const users: IUser[] = convertRawToUser(JSON.stringify(rawData));

	return users;
}

const url: TUrl = 'https://dummyjson.com/users';

/**
 *  			main
*/
__main(url)
	.then((users: IUser[]) => {
			users.forEach( (item: IUser)  => {
			printUserInfo(item);
		})
	})
	.catch((e: Error) => {
		console.log(e.message)
		console.log('Что-то пошло не так')
	});
