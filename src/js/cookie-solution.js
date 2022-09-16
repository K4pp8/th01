const containerClassName = 'content-consent';

let options = [
  { purposeId: 'purpose1', description: 'purpose 1', checked: true },
  { purposeId: 'purpose2', description: 'purpose 2', checked: true },
  { purposeId: 'purpose3', description: 'purpose 3', checked: true },
  { purposeId: 'purpose4', description: 'purpose 4', checked: true }
];

const getOptionsDOMElements = (options) => {
  const unorderedList = document.createElement('ul');
  unorderedList.style.cssText = `list-style-type: none; padding: 0;`;

  options.forEach(option => {
    const listItem = document.createElement('li');

    const optionDescription = document.createElement('span');
    optionDescription.textContent = option.description;

    const x = document.createElement("input");
    x.setAttribute("type", "checkbox");
    x.name = option.purposeId;
    x.checked = option.checked;

    listItem.append(x, optionDescription);
    unorderedList.appendChild(listItem);
  })

  return unorderedList;
}

const getButtonsDOMElements = (acceptClicked, rejectClicked) => {
  const footerConsent = document.createElement('div');
  footerConsent.style.textAlign = 'right';

  const acceptBtn = document.createElement("button");
  acceptBtn.type = 'button';
  acceptBtn.innerHTML = "Accept";
  acceptBtn.onclick = acceptClicked;
  acceptBtn.style.cssText = `
    margin-left: 20px;
    border-radius: 8px;
    padding: 4px 8px;
    border: solid 1px gray;
  `;

  const rejectBtn = document.createElement("button");
  rejectBtn.type = 'button';
  rejectBtn.classList.add('rejectBtn');
  rejectBtn.innerHTML = "Reject";
  rejectBtn.onclick = rejectClicked;
  rejectBtn.style.cssText = `
    margin-left: 20px;
    border-radius: 8px;
    padding: 4px 8px;
    border: solid 1px gray;
  `;

  footerConsent.append(rejectBtn, acceptBtn);
  return footerConsent;
}

const enableContainers = (query, dictionary) => {
  const dummyElements = document.querySelectorAll(query);
  dummyElements.forEach(current => {
    const canBeEnabled = Array.from(current.classList)
      .filter(className => className.search("purpose") !== -1)
      .every(className => dictionary[className]);

    if (canBeEnabled) {
      current.classList.add('enabled');
    } else {
      current.classList.remove('enabled');
    }
  });
};

const openConsentDialog = (className) => {
  const contentConsent = document.createElement('div');
  contentConsent.classList.add(className);
  contentConsent.style.cssText = `
    background: #ffffff;
    color: #000000;
    border-radius: 20px;
    text-align: left;
    margin: 20px;
    padding: 20px;
    border: solid 1px gray;

    position: absolute;
    z-index: 2;
    top: 20px;
    left: 10%;
    right: 10%;
    width: 70%;
  `;

  contentConsent.append(
    'We and selected third parties use cookies for technical purposes and, with your consent, for other purposes.',
    getOptionsDOMElements(options),
    getButtonsDOMElements(acceptClicked, rejectClicked)
  );
  document.querySelector('body').append(contentConsent);
}

const closeConsentDialog = (className) => {
  const boxes = document.getElementsByClassName(className);
  Array.from(boxes).forEach(box => { box.remove(); });
}

const addEditingBtn = (editClicked) => {
  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.innerHTML = 'Edit Preferences';
  editBtn.onclick = editClicked;
  editBtn.style.cssText = `
    position: absolute;
    bottom:0;
    right: 0
  `;

  document.querySelector('body').append(editBtn);
}

const updateOptions = () => {
  const consentSDictionary = JSON.parse(localStorage.getItem('content-consent'));
  options = options.map(option => ({
    ...option,
    checked: consentSDictionary[option.purposeId]
  }));
}

const editClicked = () => {
  updateOptions();
  openConsentDialog(containerClassName);
}

const acceptClicked = () => {
  const optionsCheckbox = document.querySelectorAll('ul li input');
  let isCheckedDictionary = { 'nopurpose': true };

  optionsCheckbox.forEach(current => {
    isCheckedDictionary[current.name] = current.checked;
  });

  enableContainers('.dummy-element', isCheckedDictionary);

  localStorage.setItem('content-consent', JSON.stringify(isCheckedDictionary));
  closeConsentDialog(containerClassName);
  addEditingBtn(editClicked);
}

const rejectClicked = () => {
  const optionsCheckbox = document.querySelectorAll('.dummy-element');
  optionsCheckbox.forEach(element => {
    element.classList.remove("enabled");
  });

  localStorage.setItem('content-consent', '{}');
  closeConsentDialog(containerClassName);
  addEditingBtn(editClicked);
}
window.onload = function () {
  if (!localStorage.getItem('content-consent')) {
    openConsentDialog(containerClassName);
  } else {
    const consentSDictionary = JSON.parse(localStorage.getItem('content-consent'));
    updateOptions();
    enableContainers('.dummy-element', consentSDictionary);
    addEditingBtn(editClicked);
  }
};

// Alternatives to be discussed at interview
// document.onreadystatechange = () => {});
// addEventListener('DOMContentLoaded', (event) => {});
