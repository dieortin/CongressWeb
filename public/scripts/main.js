function toggleDropdownVisibility() {
	const element = document.getElementsByTagName('nav')[0]
	if (element.classList.contains('hidden')) {
		element.classList.remove('hidden')
	} else {
		element.classList.add('hidden')
	}
}

function approveParticipant(id, el) {
	const req = new XMLHttpRequest()
	req.addEventListener('load', () => {
		console.log('Request sent')
	})

	req.onreadystatechange = () => {
		if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
			console.log('Correct approval, removing participant from list')
			el.parentNode.removeChild(el)
		}
	}

	req.open('POST', 'manageParticipants/approve/' + id)
	req.send()
}