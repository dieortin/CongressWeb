function toggleDropdownVisibility() {
	const element = document.getElementsByTagName('nav')[0]
	if (element.classList.contains('hidden')) {
		element.classList.remove('hidden')
	} else {
		element.classList.add('hidden')
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

	req.open('POST', 'manageParticipants/approve/' + id)
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

	req.open('POST', 'manageParticipants/reject/' + id)
	req.send()
}