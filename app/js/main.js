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

	const token = 'Z2hwXzdjV2dnS1g1WDVHM3QyeWh0T2FCSTNZUmVYTVNmcTFKdU03OQ==';

    function updateFileContent(newData) {
        return getFileContent()
            .then(({ content, sha }) => {
                // Подготовьте новое содержимое
                const updatedContent = JSON.stringify(newData, null, 2);
                const base64Content = btoa(updatedContent);

                // URL GitHub API для обновления файла
                const updateUrl = `https://api.github.com/repos/${username}/${repository}/contents/${filename}`;

                return fetch(updateUrl, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${decodeBase64(token)}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: 'Updating JSON data',
                        content: base64Content,
                        sha: sha,
                        branch: branch
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Файл успешно обновлён:', data);
                });
            });
    }

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

        updateFileContent(jsonData)
            .catch(error => {
                console.error('Ошибка при обновлении JSON:', error);
            });

	})
})