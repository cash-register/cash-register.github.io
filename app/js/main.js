$(document).ready(function () {
	$('body').css('display', 'block');

	// Переменные для вашего GitHub репозитория
	const username = 'cash-register';	 // Замените на ваше имя пользователя
	const repository = 'cash-register'; // Замените на ваш репозиторий
	const branch = 'main';				// Замените на нужную ветку
	const filename = 'jsonData.json'; // Путь к вашему JSON файлу

	// Сформируйте URL сырого JSON файла из вашего GitHub репозитория
	const jsonUrl = `https://raw.githubusercontent.com/${username}/${repository}/${branch}/${filename}`;

	// Чтение данных из JSON файла и вывод в консоль
	fetch(jsonUrl)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok ' + response.statusText);
			}
			return response.json();
		})
		.then(data => {
			console.log('Данные из JSON файла:', data);
		})
		.catch(error => {
			console.error('Ошибка при получении JSON:', error);
		});

	$('.btn').on('click', function () {

		const number = $('#number').val();
		const switches = {
			"1p1": $('#1p1').is(':checked'),
			"5pd": $('#5pd').is(':checked'),
			"dp2": $('#dp2').is(':checked'),
			"dp4": $('#dp4').is(':checked'),
			"1p1s": $('#1p1s').is(':checked'),
			"3p3s": $('#3p3s').is(':checked')
		}

		const jsonData = {
			"number": number,
			"switches": switches
		}

	})
})