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

interface ICompany extends IAddress {
	// address: IAddress;
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
	gender: GENDER;
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
	const user: IUser[] = [];
	const rawObj = JSON.parse(rawJSONasString)?.users as IUser[];

	if (!rawObj) throw new Error('Нет данных для обработки');

	for (const el of rawObj) {
		user.push({
			id: el.id,
			firstName: el.firstName,
			lastName: el.lastName,
			maidenName: el.maidenName,
			age: el.age,
			gender: isGender(el.gender) ? GENDER[el.gender as GENDER] : '',
			email: el.email,
			phone: el.phone,
			username: el.username,
      password: el.password,
      birthDate: el.birthDate,
      image: el.image,
      bloodGroup: el.bloodGroup,
      height: el.height,
			weight: el.weight,
      eyeColor: el.eyeColor,
      hair: el.hair,
      domain: el.domain,
			ip: el.ip,
			address: el.address,
			macAddress: el.macAddress,
			university: el.university,
			bank: el.bank,
			company: el.company,
			ein: el.ein,
			ssn: el.ssn,
			userAgent: el.userAgent
		} as IUser)
	}

	return user;
}

function printUserInfo(user: IUser) {
	console.log(chalk.bold(user.id),
		chalk.grey(user.firstName),
		chalk.underline(user.email),
		user.address,
		chalk.underline(user.gender),
	);
}

async function main(url: TUrl): Promise<IUser []> {
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
main(url)
	.then((users: IUser[]) => {
			users.forEach( (item: IUser)  => {
			printUserInfo(item);
		})
	})
	.catch((e: Error) => {
		console.log(e.message)
		console.log('Что-то пошло не так')
	});
