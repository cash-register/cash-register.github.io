$(document).ready(function () {

	$('body').css('display', 'block');

	// Установка даты

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

		const multiplier = 4;

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

	function syncScroll(source, target) {
		target.scrollLeft(source.scrollLeft());
	}

	// Создание и сохранение данных

	$('#addRow').on('click', function() {
		const date = $('#date').val();
		const deviceCount = $('#device-count').val();
		const smokeCount = $('#smoke-count').val();
		const result = calculateResult(deviceCount, smokeCount);

		const data = {
			date: date,
			deviceCount: parseInt(deviceCount),
			smokeCount: parseInt(smokeCount),
			result: parseInt(result)
		};

		let dataList = JSON.parse(localStorage.getItem('dataList')) || [];

		dataList.push(data);

		localStorage.setItem('dataList', JSON.stringify(dataList));

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
		// $('#data-table tbody .data').empty();

		let totalResult = 0;
		let totalDevices = 0;
		let totalSmokes = 0;

		// Добавление строк в таблицу
		dataList.forEach((item, index) => {
				const row = `<tr>
					<td><span class="badge badge-primary">${normalFormatDate(item.date)}</span></td>
					<td><span class="badge badge-success">${item.deviceCount} шт</span></td>
					<td><span class="badge badge-success">${item.smokeCount} шт</span></td>
					<td><span class="badge badge-primary">${item.result} тг</span></td>
					<td class="for-delete-btn"><button class="btn btn-outline-danger btn-sm deleteRow" data-index="${index}"><i class="fa fa-times" aria-hidden="true"></i></button></td>
				</tr>`;

			$('#data-table tbody').append(row);

			totalResult += item.result;
			totalDevices += item.deviceCount;
			totalSmokes += item.smokeCount;

			$('#data-table .caption-1').text(`Общая сумма: ${totalResult} тг`);
			$('#data-table .caption-2').text(`Девайсов за месяц: ${totalDevices} шт`);
			$('#data-table .caption-3').text(`Сигарет за месяц: ${totalSmokes} шт`);
		});

	}

	renderTable();

	// Выделение sticky элемента

	$(window).on('scroll', function() {
		var stickyElement = $('.sticky-top');
		var isSticky = stickyElement.offset().top <= $(window).scrollTop();

		if (isSticky) {
			$('#create-data-table').parent('.table-wrapper').addClass('sticky-table');
		}
		else {
			$('#create-data-table').parent('.table-wrapper').removeClass('sticky-table');
		}
	});

	// Синхронизация скролла таблиц

	$('#create-data-table').on('scroll', function() {
		syncScroll($('#create-data-table'), $('#data-table'));
	});

	$('#data-table').on('scroll', function() {
		syncScroll($('#data-table'), $('#create-data-table'));
	});

	// Удаление строки

	$('.deleteRow').on('click', function () {
		const index = $(this).data('index');

		if (index !== undefined) {
			let data = JSON.parse(localStorage.getItem('dataList'));
			data.splice(index, 1);
			console.log(data);
			localStorage.setItem('dataList', JSON.stringify(data));
			window.location.reload();
		}
	})

	// Сдвигание строки таблицы

	$('#data-table tr').on('touchstart', function () {

		let width = $(this).find('td.for-delete-btn').outerWidth();

		$('#data-table tr').css('transform', 'translateX(0px)')
		$(this).css('transform', `translateX(-${width}px)`)
	})

})
