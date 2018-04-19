function toggleDropdownVisibility() {
	const element = document.getElementsByTagName('nav')[0]
	if (element.classList.contains('hidden')) {
		element.classList.remove('hidden')
	} else {
		element.classList.add('hidden')
	}
}