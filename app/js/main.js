$(document).ready(function () {

	$('body').css('display', 'block');

	// Утсновка даты

	function formatDate(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function normalFormatDate(dateString) {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы от 0 до 11
		const year = date.getFullYear();
		return `${day}.${month}.${year}`;
	}

	const today = new Date();

	$('#date').val(formatDate(today));

	// Установка значений по умолчанию

	function setupInputField(selector, defaultValue) {
		$(selector).on('focus', function() {
			if ($(this).val() === defaultValue) {
		$(this).val('');
			}
		}).on('blur', function() {
			if ($(this).val() === '') {
		$(this).val(defaultValue);
			}
		});
	}

	// Установка полей ввода с дефолтными значениями
	setupInputField('#device-count', '0');
	setupInputField('#smoke-count', '0');

	// Подсчёт результата

	function calculateResult(deviceCount, smokeCount) {
		let result = 0;

		// Умножитель для расчета результата
		const multiplier = 4;

		// Условия для расчета результата
		if (deviceCount == 0) {
			result = (smokeCount < 6) ? 800 * multiplier : 960 * multiplier;
		}
		else if (deviceCount == 1) {
			result = ((smokeCount < 6) ? 800 * multiplier : 960 * multiplier) + 1000;
		}
		else if (deviceCount == 2) {
			result = ((smokeCount < 6) ? 1550 * multiplier : 1860 * multiplier) + 2000;
		}
		else if (deviceCount == 3) {
			result = ((smokeCount < 6) ? 1860 * multiplier : 2240 * multiplier) + 3000;
		}
		else if (deviceCount >= 4) {
			result = ((smokeCount < 6) ? 1860 * multiplier : 2240 * multiplier) + deviceCount * 1000;
		}

		return result;
	}

	// Сохранение данных

	$('#addRow').on('click', function() {
		// Получение значений из полей ввода
		const date = $('#date').val();
		const deviceCount = $('#device-count').val();
		const smokeCount = $('#smoke-count').val();
		const result = calculateResult(deviceCount, smokeCount);

		// Создание объекта с данными
		const data = {
			date: date,
			deviceCount: parseInt(deviceCount),
			smokeCount: parseInt(smokeCount),
			result: parseInt(result)
		};

		// Получение существующих данных из localStorage
		let dataList = JSON.parse(localStorage.getItem('dataList')) || [];

		// Добавление нового объекта в массив данных
		dataList.push(data);

		// Сохранение обновленного массива в localStorage
		localStorage.setItem('dataList', JSON.stringify(dataList));

		// Очистка полей ввода
		$('#date').val(formatDate(today));
		$('#device-count').val('0');
		$('#smoke-count').val('0');

		window.location.reload()
	});

	// Очистка данных

	$('#clearData').on('click', function () {
		localStorage.clear();
		window.location.reload();
	})

	// Вывод данных

	function renderTable() {
		// Получение данных из localStorage
		let dataList = JSON.parse(localStorage.getItem('dataList')) || [];

		// Очистка таблицы
		$('.empty').empty();

		let totalResult = 0;
		let totalDevices = 0;
		let totalSmokes = 0;

		// Добавление строк в таблицу
		dataList.forEach((item, index) => {
				const row = `<tr>
			<td>${index + 1}</td>
			<td><span class="font-weight-bold">${normalFormatDate(item.date)}</span></td>
			<td><span class="badge badge-success">${item.deviceCount} шт</span></td>
			<td><span class="badge badge-success">${item.smokeCount} шт</span></td>
			<td><span class="badge badge-primary">${item.result} тг</span></td>
				</tr>`;

			$('tbody').append(row);

			totalResult += item.result;
			totalDevices += item.deviceCount;
			totalSmokes += item.smokeCount;

			$('table .caption-1').text(`Общая сумма: ${totalResult} тг`);
			$('table .caption-2').text(`Девайсов за месяц: ${totalDevices} шт`);
			$('table .caption-3').text(`Сигарет за месяц: ${totalSmokes} шт`);
		});

	}

	renderTable();
})
