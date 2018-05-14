function setExtraFieldsVisibility() {
	const checkbox = document.getElementById('toggleFields')
	const fields = document.getElementById('extraFields')
	if (checkbox.checked) {
		fields.classList.remove('hidden')
		return 'Showing'
	} else {
		fields.classList.add('hidden')
		return 'Hiding'
	}
}


function toggleDropdownVisibility() {
	toggleElementVisibility(document.getElementsByTagName('nav')[0])
}

function toggleElementVisibility(el) {
	if (el.classList.contains('hidden')) {
		el.classList.remove('hidden')
	} else {
		el.classList.add('hidden')
	}
}

function approveParticipant(id) {
	const req = new XMLHttpRequest()
	req.addEventListener('load', () => {
		console.log('Approval request sent')
	})

	req.onreadystatechange = () => {
		if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
			console.log('Correct approval, removing participant from list')
			const element = document.getElementById(id)
			element.parentNode.removeChild(element)
		}
	}

	req.open('POST', 'participantApproval/approve/' + id)
	req.send()
}

function rejectParticipant(id) {
	const req = new XMLHttpRequest()
	req.addEventListener('load', () => {
		console.log('Rejection request sent')
	})

	req.onreadystatechange = () => {
		if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
			console.log('Correct rejection, removing participant from list')
			const element = document.getElementById(id)
			element.parentNode.removeChild(element)
		}
	}

	req.open('POST', 'participantApproval/reject/' + id)
	req.send()
}

function unapproveParticipant(id) {
	const req = new XMLHttpRequest()
	req.addEventListener('load', () => {
		console.log('Rejection request sent')
	})

	req.onreadystatechange = () => {
		if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
			console.log('Correct unapproval, removing participant from list')
			const element = document.getElementById(id)
			element.parentNode.removeChild(element)
		}
	}

	req.open('POST', 'participantApproval/revoke/' + id)
	req.send()
}