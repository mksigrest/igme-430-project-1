nameSub = document.getElementById('nameSubmit');
locSub = document.getElementById('locationSubmit');
finSub = document.getElementById('financeSubmit');

async function getHeadFun(e, subType, urlBase, subOutput) {
    e.preventDefault();
    const endpoint = document.getElementById(subType).closest('.endpoint');

    const params = new URLSearchParams();
    if (subType === 'nameSubmit') {
        const capital = endpoint.querySelector('.capitalField').value.trim();
        const region = endpoint.querySelector('.regionField').value.trim();
        if (capital) params.append('capital', capital);
        if (region) params.append('region', region);
    }
    else if (subType === 'locationSubmit' || subType === 'financeSubmit') {
        const name = endpoint.querySelector('.nameField').value.trim();
        const capital = endpoint.querySelector('.capitalField').value.trim();
        if (name) params.append('name', name);
        if (capital) params.append('capital', capital);
    }

    const url = urlBase + (params.toString() ? `?${params.toString()}` : '');
    const method = document.getElementById('nameMethodSelect').value.toUpperCase();
    const response = await fetch(url, { method });
    const funOutput = document.getElementById(subOutput);

    if (method !== 'HEAD') {
        if (response.ok) {
            const data = await response.json();

            if (subType === 'nameSubmit') {
                const list = data.map(c => {
                    const displayName = (c.name && (c.name.common || c.name))
                    return `<li><strong>${displayName}</strong></li>`;
                }).join('');
                funOutput.innerHTML = `<strong>Found ${data.length}</strong><ul>${list}</ul>`;
            }
            else if (subType === 'locationSubmit') {
                const list = data.map(c => {
                    const displayName = (c.name && (c.name.common || c.name))
                    const displayLat = (c.latitude);
                    const displayLog = (c.longitude);
                    return `<li><strong>${displayName}</strong> - Lat: ${displayLat} - Long: ${displayLog}</li>`;
                }).join('');
                funOutput.innerHTML = `<strong>Found ${data.length}</strong><ul>${list}</ul>`;
            }
            else if (subType === 'financeSubmit') {
                const list = data.map(c => {
                    const displayName = (c.name && (c.name.common || c.name))
                    const displayCurName = (c.finance.currency_name);
                    const displayCurSym = (c.finance.currency_symbol);
                    return `<li><strong>${displayName}</strong> - Currency Name: ${displayCurName} - Currency Symbol: ${displayCurSym}</li>`;
                }).join('');
                funOutput.innerHTML = `<strong>Found ${data.length}</strong><ul>${list}</ul>`;
            }
            else {
                funOutput.innerHTML = `<strong>Success</strong> <br> <br> ${JSON.stringify(data)}`;
            }

            console.log(data);
        }
        else {
            const error = response.json();
            nameOutput.innerHTML = `<strong>Not Found</strong> <br> <br> Message: ${error.message}`;
            console.log(error);
        }
    }
    else {
        if (response.ok) {
            nameOutput.innerHTML = `<strong>Success</strong>`
        }
        else {
            nameOutput.innerHTML = `<strong>Not Found</strong>`
        }
    }
}

async function addFun(e) {
    e.preventDefault();
    const endpoint = document.getElementById('addSubmit').closest('.endpoint');
    const url = '/api/addCountry';
    const addOutput = document.getElementById('addOutput');

    const body = {
        name: endpoint.querySelector('.nameField').value.trim(),
        capital: endpoint.querySelector('.capitalField').value.trim(),
        longitude: endpoint.querySelector('.longField').value.trim(),
        latitude: endpoint.querySelector('.latitField').value.trim(),
    }

    const response = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(body),
    })
        .then((response) => {
            if (response.status === 201) {
                addOutput.innerHTML = `Succesfully created the country ${body.name} with 
            a capital of ${body.capital}at Long: ${body.longitude} Lat: ${body.latitude}!`;
                return response.json()
            }
            else {
                addOutput.innerHTML = `Adding error`;
            }
        });
}

async function editFun(e) {
    e.preventDefault();
    const endpoint = document.getElementById('editSubmit').closest('.endpoint');
    const url = '/api/editCapital';
    const editOutput = document.getElementById('editOutput');

    const body = {
        name: endpoint.querySelector('.nameField').value.trim(),
        capital: endpoint.querySelector('.capitalField').value.trim(),
        newCapital: endpoint.querySelector('.newCapitalField').value.trim(),
    }

    const response = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(body),
    })
        .then((response) => {
            if (response.status === 200) {
                editOutput.innerHTML = `Succesfully edited country capital 
            ${body.capital} to ${body.newCapital}!`;
                return response.json()
            }
            else {
                editOutput.innerHTML = `Editing error`;
            }
        });
}