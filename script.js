window.addEventListener('DOMContentLoaded', async function () {
	const wordDisplay = document.getElementById('word-display');
	const guessInput = document.getElementById('guess-input');
	const checkButton = document.getElementById('check-button');
	const keyboardContainer = document.getElementById('keyboard-container');
	const keyboardLetters = document.querySelectorAll('.keyboard-letter');
	const backspaceButton = document.getElementById('backspace-button');
	const attemptsDisplay = document.getElementById('attempts-display');

	let attempts = 0;
	let usedLetters = [];


	if (!document.cookie){
		document.cookie=0;
	}
	console.log(document.cookie);
	document.getElementById("level").textContent+=document.cookie;


	async function getfiles() {
		const g = await fetch("/guesses.txt");
		var guesses = await g.text()
		window.guesses = await guesses.split("\n");

		const a = await fetch("/ans.txt");
		var ans = await a.text()
		window.ans = await ans.split("\n");
		}


	await getfiles();

	const word = await ans[document.cookie].toUpperCase();

	function createNewRow() {
		const newRow = document.createElement('div');
		newRow.classList.add('word-row');
		wordDisplay.appendChild(newRow);

		for (let i = 0; i < word.length; i++) {
			const newLetter = document.createElement('span');
			newLetter.classList.add('letter');
			newRow.appendChild(newLetter);
		}
	}

	function checkGuess() {
		const guess = guessInput.value.toUpperCase();
		if (guess.length !== word.length) {
			alert('Please enter a guess with exactly ' + word.length + ' letters.');
			return;
		}
		if (!guesses.includes(guess.toLowerCase())) {
			alert('Not a valid word');
			return;
		}
		for (let i = 0; i < 5; i++){
			usedLetters.push(guess[i]);
		}

		attempts++;

		const currentRow = document.querySelector('.word-row:last-child');
		const letterSpans = currentRow.querySelectorAll('.letter');

		for (let i = 0; i < word.length; i++) {
			if (guess[i] === word[i]) {
								letterSpans[i].style.backgroundColor = 'green';
			} else if (word.includes(guess[i])) {
				letterSpans[i].style.backgroundColor = 'yellow';
			} else {
				letterSpans[i].style.backgroundColor = 'red';
			}
			letterSpans[i].textContent = guess[i];

		}

		if (guess === word) {
			alert('Congratulations! You guessed the word in ' + attempts + ' attempts.');
			hello = parseInt(document.cookie);
			hi=hello+1;
			document.cookie=hi;	
			document.getElementById("reload").style.visibility="visible";
		} else if (attempts >= 6) {
			alert('Sorry, you ran out of attempts. The word was: ' + word);
			document.getElementById("reload").textContent="retry";
			document.getElementById("reload").style.visibility="visible";
		}

		guessInput.value = '';
		createNewRow();
		disableUsedLetters();
	}

	function disableUsedLetters() {
		console.log(usedLetters);
		keyboardLetters.forEach(function (letter) {
			if (usedLetters.includes(letter.textContent)) {
				letter.disabled = true;
				letter.classList.add('used');
			}
		});
	}

	function resetGame() {
		attempts = 0;
		usedLetters = [];
		wordDisplay.innerHTML = '';
		keyboardLetters.forEach(function (letter) {
			letter.disabled = false;
			letter.classList.remove('used');
		});
	}

	createNewRow();
	checkButton.addEventListener('click', checkGuess);
	var input = document.getElementById("guess-input");
	input.addEventListener("keypress", function(event) {
	if (event.key === "Enter") {
		event.preventDefault();
		document.getElementById("check-button").click();
	}
});

});
