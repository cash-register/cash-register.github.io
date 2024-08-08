function decodeBase64(encodedText) {
    return decodeURIComponent(escape(atob(encodedText)));
}

$(document).ready(function () {
	$('body').css('display', 'block');

	const username = 'cash-register';
	const repository = 'cash-register.github.io';
	const branch = 'main';
	const filename = 'jsonData.json';

	const apiUrl = `https://api.github.com/repos/${username}/${repository}/contents/${filename}?ref=${branch}`;

	const token = decodeBase64('Z2hwXzdjV2dnS1g1WDVHM3QyeWh0T2FCSTNZUmVYTVNmcTFKdU03OQ==');
	console.log(token);

    // Чтение данных из JSON файла и вывод в консоль
    fetch(apiUrl, {
        headers: {
            'Authorization': `token ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const content = atob(data.content); // Декодируем base64
            const jsonData = JSON.parse(content);
            console.log('Данные из JSON файла:', jsonData);
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