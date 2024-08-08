$(document).ready(function () {
	$('body').css('display', 'block');

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