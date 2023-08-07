// Получение последнего дня месяца
function getLastDayOfMonth(year, month) {
	return new Date(year, month + 1, 0).getDate();
}

const dbName = 'myDatabase';
const dbVersion = 3;
const tableName = 'myTable1';
let db;

// Функция создания IndexDB
function openDB() {
	const request = indexedDB.open(dbName, dbVersion);

	request.onupgradeneeded = function(event) {
		const db = event.target.result;
		if (!db.objectStoreNames.contains(tableName)) {
			db.createObjectStore(tableName, { keyPath: 'id', autoIncrement: true });
		}
	};

	request.onsuccess = function(event) {
		db = event.target.result;
		displayTableData();
	};

	request.onerror = function(event) {
		console.error("Error opening database:", event.target.error);
	};
}

// Функиця добавления данных в IndexDB
function addRowToTable(date, amount, isHoliday) {
	const transaction = db.transaction([tableName], 'readwrite');
	const objectStore = transaction.objectStore(tableName);
	const newRow = { date, amount, isHoliday };

	const request = objectStore.add(newRow);

	request.onsuccess = function() {
		displayTableData();
	};

	request.onerror = function(event) {
		console.error("Error adding row to table:", event.target.error);
	};
}

// Функция показа таблицы и добавления строк
function displayTableData() {
	const tableBody = $('#dataTable tbody');
	tableBody.empty();

	const transaction = db.transaction(tableName, 'readonly');
	const objectStore = transaction.objectStore(tableName);

	objectStore.openCursor().onsuccess = function(event) {
		const cursor = event.target.result;
		if (cursor) {
			const row = $('<tr>');
			if (cursor.value.isHoliday) {
				row.addClass('holiday');
				row.append(
					$('<th>', { scope: 'row', text: cursor.value.date.split('-').reverse().join('.') }),
					$('<td>', { text: 'Holiday', class: 'font-weight-bold' })
				);
			} else {
				row.append(
					$('<th>', { scope: 'row', text: cursor.value.date.split('-').reverse().join('.') }),
					$('<td>', { text: cursor.value.amount, class: 'number' })
				);
			}
			tableBody.append(row);
			var totalAmount = 0;
			$('td.number').each(function () {
				var cellValue = parseFloat($(this).text());
				if (!isNaN(cellValue)) {
					totalAmount += cellValue;
				}
			})
			$('caption span').text(totalAmount)
			cursor.continue();
		}
	};
}

// Функция очистка таблицы
function clearTableData() {
	const transaction = db.transaction([tableName], 'readwrite');
	const objectStore = transaction.objectStore(tableName);

	const request = objectStore.clear();

	request.onsuccess = function() {
		displayTableData();
	};

	request.onerror = function(event) {
		console.error("Error clearing table data:", event.target.error);
	};
}


$(document).ready(function() {

	const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	const IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	const IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

	if (!indexedDB) {
		$('.container').html($('<h1>', {class: 'display-1', text: 'Stop! Your browser is not supported!'}))
	}

	// Открытие IndexDB
	openDB();

	// Очистка всех полей
	$('#amount').val('');

	// Вызов функции подсчёта итоговой суммы
	// console.log($('tbody').contents().find('html').find('body').html())

	// Добавление строки
	$('#setRow').on('click', function () {
		if ($('#amount').val() !== '') {
			addRowToTable($('#date').val(), $('#amount').val(), $('#isHoliday').prop('checked'));
			window.location.reload();
		}
		else {
			if (!$('#isHoliday').prop('checked')) {
				// Инициализация tooltip
				$('[data-toggle="tooltip"]').tooltip('show');
			}
			else {
				addRowToTable($('#date').val(), $('#amount').val(), $('#isHoliday').prop('checked'));
				window.location.reload();
			}
		}
	});

	// Очистка таблицы
	$('#clearData').on('click', function () {
		clearTableData();
		window.location.reload();
	});

	// Проверка на существования имени
	if (localStorage.getItem('name')) {
		$('.set-row').show();
		$('.name').text(localStorage.getItem('name'));
	} else {
		$('.set-name').show();
	}

	// Установка настоящего времени в Input
	date = new Date().toISOString().split('T')[0];
	$('#date').val(date);

	// Анимация для label
	$('.form-control').on('focus', function () {
		$(this).parent().find('label.movable').css({
			'top': '-25%',
			'font-size': '18px'
		})
		$('.custom-control').css({
			'pointer-events': 'none',
			'opacity': 0.5
		});
	})
	.on('blur', function () {
		if ($(this).val() === '') {
			$(this).parent().find('label.movable').css({
				'top': '50%',
				'font-size': '24px'
			})
			$('.custom-control').css({
				'pointer-events': 'all',
				'opacity': 1
			});
		}
	})

	// Отслеживание checkbox
	$('#isHoliday').change(function () {
		if ($(this).prop('checked')) {
			$('#amount').css({
				'pointer-events': 'none',
				'opacity': 0.5
			});
		}
		else {
			$('#amount').css({
				'pointer-events': 'all',
				'opacity': 1
			});
		}
	})

	// Сохранение имени в LocalStorage
	$('#setName').on('click', function () {
		localStorage.setItem('name', $('#name').val());

	})

});