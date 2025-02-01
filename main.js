var popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
var popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
