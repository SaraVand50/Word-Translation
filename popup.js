document.addEventListener('DOMContentLoaded', async function () {
    // Supported languages
    const languageSelect = document.getElementById('languageSelect');

    // Sending a message to background.js to get user preferences
    chrome.runtime.sendMessage({ action: 'getUserPreferences' }, function (response) {
        if (response && response.translationLanguage) {
            languageSelect.value = response.translationLanguage;
        } else {
            languageSelect.value = 'en'; // Default language
        }
    });

    // Translation function
    document.getElementById('translateButton').addEventListener('click', function () {
        translate();
    });

    async function fetchLanguages(languageSelect) {
        const url = 'https://google-translate113.p.rapidapi.com/api/v1/translator/support-languages';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '1a5eb2e10bmsh12ef6339e160b57p1b8005jsna14b16c8be69', 
                'X-RapidAPI-Host': 'google-translate113.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();

            // Language options
            result.forEach(lang => {
                const option = document.createElement('option');
                option.value = lang.code;
                option.text = lang.language;
                languageSelect.appendChild(option);
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchTranslation(text, toLanguage) {
        const url = 'https://google-translate113.p.rapidapi.com/api/v1/translator/text';
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': '1a5eb2e10bmsh12ef6339e160b57p1b8005jsna14b16c8be69', 
                'X-RapidAPI-Host': 'google-translate113.p.rapidapi.com'
            },
            body: new URLSearchParams({
                from: 'auto',
                to: toLanguage,
                text: text
            })
        };

          // Handling errors
        try {
            const response = await fetch(url, options);
            const result = await response.json();
    
            if (result && result.trans) {
                return result.trans;
            } else {
                console.error('Unexpected translation response:', result);
                return 'No Input Words!';
            }
        } catch (error) {
            console.error(error);
            return 'Translation error';
        }
    }

    window.translate = async function () {
        const inputText = document.getElementById('inputText').value;
        const selectedLanguage = languageSelect.value;

        // Fetching translation
        const translation = await fetchTranslation(inputText, selectedLanguage);

        // Result
        document.getElementById('translationResult').innerText = `Translation: ${translation}`;
    };

    // Supported languages on page load
    await fetchLanguages(languageSelect);
});
