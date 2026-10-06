const passwordInput = document.getElementById("password");
const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const lowercase = document.getElementById("lowercase");
const uppercase = document.getElementById("uppercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const message = document.getElementById("message");
const strengthText = document.getElementById("strengthText");
const meterBar = document.getElementById("meterBar");

const sets = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/"
};

function secureRandom(max) {
  const array = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  let value;

  do {
    crypto.getRandomValues(array);
    value = array[0];
  } while (value >= limit);

  return value % max;
}

function randomCharacter(characters) {
  return characters[secureRandom(characters.length)];
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = secureRandom(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generatePassword() {
  message.textContent = "";

  const selectedSets = [];

  if (lowercase.checked) selectedSets.push(sets.lowercase);
  if (uppercase.checked) selectedSets.push(sets.uppercase);
  if (numbers.checked) selectedSets.push(sets.numbers);
  if (symbols.checked) selectedSets.push(sets.symbols);

  const length = Number(lengthInput.value);

  if (selectedSets.length === 0) {
    passwordInput.value = "";
    message.textContent = "Selecciona al menos un tipo de carácter.";
    return;
  }

  if (length < selectedSets.length) {
    passwordInput.value = "";
    message.textContent = "La longitud debe permitir incluir los tipos seleccionados.";
    return;
  }

  let password = [];

  selectedSets.forEach(set => {
    password.push(randomCharacter(set));
  });

  const allCharacters = selectedSets.join("");

  while (password.length < length) {
    password.push(randomCharacter(allCharacters));
  }

  password = shuffle(password).join("");
  passwordInput.value = password;
  updateStrength(password);
}

function updateStrength(password) {
  let score = 0;

  if (password.length >= 12) score += 2;
  if (password.length >= 16) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score >= 6) {
    strengthText.textContent = "Muy segura";
    meterBar.style.width = "100%";
  } else if (score >= 4) {
    strengthText.textContent = "Segura";
    meterBar.style.width = "75%";
  } else if (score >= 2) {
    strengthText.textContent = "Media";
    meterBar.style.width = "50%";
  } else {
    strengthText.textContent = "Débil";
    meterBar.style.width = "25%";
  }
}

lengthInput.addEventListener("input", () => {
  lengthValue.textContent = lengthInput.value;
});

generateBtn.addEventListener("click", generatePassword);

copyBtn.addEventListener("click", async () => {
  if (!passwordInput.value) {
    message.textContent = "Primero genera una contraseña.";
    return;
  }

  try {
    await navigator.clipboard.writeText(passwordInput.value);
    copyBtn.textContent = "¡Copiada!";
    setTimeout(() => copyBtn.textContent = "Copiar", 1500);
  } catch {
    message.textContent = "No se pudo copiar automáticamente.";
  }
});

generatePassword();
