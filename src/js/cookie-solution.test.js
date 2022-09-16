import { fireEvent, getByText } from '@testing-library/dom'

describe('Cookie solution tests', () => {

    beforeEach(() => {

        document.body.innerHTML = `
        <div class="dummy-element nopurpose"> No purpose </div>
        <div class="dummy-element purpose1"> purpose 1 </div>
        <div class="dummy-element purpose2"> purpose 2 </div>
        <div class="dummy-element purpose3"> purpose 3 </div>
        <div class="dummy-element purpose4"> purpose 4 </div>
        <div class="dummy-element purpose1 purpose3"> purpose 1 and 3 </div>
    `;

        localStorage.removeItem('content-consent');
        require('./cookie-solution.js');
        window.dispatchEvent(new Event('load'));
    });

    test('It should display the policies banner', () => {
        const description = getByText(document.body, 'We and selected third parties use cookies for technical purposes and, with your consent, for other purposes.');
        expect(description).toBeTruthy();
    });

    test('It should be possible to reject the policies', () => {
        const button = getByText(document.body, 'Reject');
        fireEvent.click(button);

        const editBtn = getByText(document.body, 'Edit Preferences');
        const np = getByText(document.body, 'No purpose');

        expect(editBtn).toBeTruthy();
        expect(np.classList.contains('enabled')).toBeFalsy();
    });

    test('It should be possible to accept the policies', () => {
        const button = getByText(document.body, 'Accept');
        fireEvent.click(button);

        const nopurpose = getByText(document.body, 'No purpose');
        const editBtn = getByText(document.body, 'Edit Preferences');

        expect(editBtn).toBeTruthy();
        expect(nopurpose.classList.contains('enabled')).toBeTruthy();
    });

    test('It should be possible to accept specific policies 1', () => {
        const button = getByText(document.body, 'Accept');

        const optionsCheckbox = document.querySelectorAll('ul li input');
        optionsCheckbox.forEach(option => {
            option.checked = false;
            if (option.name === 'purpose1') { option.checked = true }
            if (option.name === 'purpose3') { option.checked = true }
        });

        fireEvent.click(button);

        const nopurpose = getByText(document.body, 'No purpose');
        const purpose1 = getByText(document.body, 'purpose 1');
        const purpose2 = getByText(document.body, 'purpose 2');
        const editBtn = getByText(document.body, 'Edit Preferences');

        expect(editBtn).toBeTruthy();
        expect(nopurpose.classList.contains('enabled')).toBeTruthy();
        expect(purpose1.classList.contains('enabled')).toBeTruthy();
        expect(purpose2.classList.contains('enabled')).toBeFalsy();
    });

    test('It should be possible to accept specific policies 2', () => {
        const button = getByText(document.body, 'Accept');

        const optionsCheckbox = document.querySelectorAll('ul li input');
        optionsCheckbox.forEach(option => {
            option.checked = false;
            if (option.name === 'purpose1') { option.checked = true }
        });

        fireEvent.click(button);

        const nopurpose = getByText(document.body, 'No purpose');
        const purpose1 = getByText(document.body, 'purpose 1');
        const purpose1and3 = getByText(document.body, 'purpose 1 and 3');
        const editBtn = getByText(document.body, 'Edit Preferences');

        expect(editBtn).toBeTruthy();
        expect(nopurpose.classList.contains('enabled')).toBeTruthy();
        expect(purpose1.classList.contains('enabled')).toBeTruthy();
        expect(purpose1and3.classList.contains('enabled')).toBeFalsy();
    });

    test('It should be possible to accept specific policies 3', () => {
        const button = getByText(document.body, 'Accept');

        const optionsCheckbox = document.querySelectorAll('ul li input');
        optionsCheckbox.forEach(option => {
            option.checked = false;
            if (option.name === 'purpose1') { option.checked = true }
            if (option.name === 'purpose3') { option.checked = true }
        });

        fireEvent.click(button);

        const nopurpose = getByText(document.body, 'No purpose');
        const purpose1 = getByText(document.body, 'purpose 1');
        const purpose3 = getByText(document.body, 'purpose 3');
        const purpose1and3 = getByText(document.body, 'purpose 1 and 3');
        const editBtn = getByText(document.body, 'Edit Preferences');

        expect(editBtn).toBeTruthy();
        expect(nopurpose.classList.contains('enabled')).toBeTruthy();
        expect(purpose1.classList.contains('enabled')).toBeTruthy();
        expect(purpose3.classList.contains('enabled')).toBeTruthy();
        expect(purpose1and3.classList.contains('enabled')).toBeTruthy();
    });

    test('It should be possible to modify the policies', () => {
        const button = getByText(document.body, 'Reject');
        fireEvent.click(button);

        const editBtn = getByText(document.body, 'Edit Preferences');
        fireEvent.click(editBtn);

        const description = getByText(document.body, 'We and selected third parties use cookies for technical purposes and, with your consent, for other purposes.');
        expect(description).toBeTruthy();
    });

});
