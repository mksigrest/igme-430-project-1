//Javascript file for client.html
nameSub = document.getElementById('nameSubmit');
locSub = document.getElementById('locationSubmit');
finSub = document.getElementById('financeSubmit');
//function for all GET and HEAD requests
async function getHeadFun(e, subType, urlBase, subOutput) {
    e.preventDefault();
    const endpoint = document.getElementById(subType).closest('.endpoint');
    const funOutput = document.getElementById(subOutput);
    //accepts params from name, being capital and reigon
    const params = new URLSearchParams();
    if (subType === 'nameSubmit') {
        const capital = endpoint.querySelector('.capitalField').value.trim();
        const region = endpoint.querySelector('.regionField').value.trim();
        if (capital) params.append('capital', capital);
        if (region) params.append('region', region);
    }
    //accepts params from location and finance, being name and capital
    else if (subType === 'locationSubmit' || subType === 'financeSubmit') {
        const name = endpoint.querySelector('.nameField').value.trim();
        const capital = endpoint.querySelector('.capitalField').value.trim();
        if (name) params.append('name', name);
        if (capital) params.append('capital', capital);
    }
    //concatinates full url with params, determines method, gets response, and determines output in .html
    const url = urlBase + (params.toString() ? `?${params.toString()}` : '');
    const method = document.getElementById('nameMethodSelect').value.toUpperCase();
    const response = await fetch(url, { method });
    //if method, then post body
    if (method !== 'HEAD') {
        if (response.ok) {
            const data = await response.json();
            //if nameSubmit pressed, display country name only
            if (subType === 'nameSubmit') {
                const list = data.map(c => {
                    const displayName = (c.name && (c.name.common || c.name))
                    return `<li><strong>${displayName}</strong></li>`;
                }).join('');
                funOutput.innerHTML = `<strong>Found ${data.length}</strong><ul>${list}</ul>`;
            }
            //if locationSubmit pressed, display name, latitute, and longitude
            else if (subType === 'locationSubmit') {
                const list = data.map(c => {
                    const displayName = (c.name && (c.name.common || c.name))
                    const displayLat = (c.latitude);
                    const displayLog = (c.longitude);
                    return `<li><strong>${displayName}</strong> - Lat: ${displayLat} - Long: ${displayLog}</li>`;
                }).join('');
                funOutput.innerHTML = `<strong>Found ${data.length}</strong><ul>${list}</ul>`;
            }
            //if financeSubmit pressed, display name and finance information
            else if (subType === 'financeSubmit') {
                const list = data.map(c => {
                    const displayName = (c.name && (c.name.common || c.name))
                    const displayCurName = (c.finance.currency_name);
                    const displayCurSym = (c.finance.currency_symbol);
                    return `<li><strong>${displayName}</strong> - Currency Name: ${displayCurName} - Currency Symbol: ${displayCurSym}</li>`;
                }).join('');
                funOutput.innerHTML = `<strong>Found ${data.length}</strong><ul>${list}</ul>`;
            }
            //else pressed, display full .json code
            else {
                funOutput.innerHTML = `<strong>Success</strong> <br> <br> ${JSON.stringify(data)}`;
            }

            console.log(data);
        }
        //if failure post message
        else {
            const error = response.json();
            funOutput.innerHTML = `<strong>Not Found</strong> <br> <br> Message: ${error.message}`;
            console.log(error);
        }
    }
    //if not GET, then just post success
    else {
        if (response.ok) {
            funOutput.innerHTML = `<strong>Success</strong>`
        }
        //if failure post nothing
        else {
            funOutput.innerHTML = `<strong>Not Found</strong>`
        }
    }
}
//function for first POST endpoint add
async function addFun(e) {
    e.preventDefault();
    const endpoint = document.getElementById('addSubmit').closest('.endpoint');
    const url = '/api/addCountry';
    const addOutput = document.getElementById('addOutput');
    //determined body info to add to countries in country
    const body = {
        name: endpoint.querySelector('.nameField').value.trim(),
        capital: endpoint.querySelector('.capitalField').value.trim(),
        longitude: endpoint.querySelector('.longField').value.trim(),
        latitude: endpoint.querySelector('.latitField').value.trim(),
    }
    //determines response with headers, and body that is turned into string
    const response = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': 0,
            'Accept': 'application/json'
        },
        body: JSON.stringify(body),
    })
    //determines output from status code
        .then((response) => {
            if (response.status === 201) {
                addOutput.innerHTML = `Succesfully created the country ${body.name} with 
                a capital of ${body.capital} at Long: ${body.longitude} Lat: ${body.latitude}!`;
                return response.json()
            }
            else {
                addOutput.innerHTML = `Adding error`;
            }
        });
}
//function for second POST endpoint edit
async function editFun(e) {
    e.preventDefault();
    const endpoint = document.getElementById('editSubmit').closest('.endpoint');
    const url = '/api/editCapital';
    const editOutput = document.getElementById('editOutput');
    //determines body info to find country to update capital to newCapital
    const body = {
        name: endpoint.querySelector('.nameField').value.trim(),
        capital: endpoint.querySelector('.capitalField').value.trim(),
        newCapital: endpoint.querySelector('.newCapitalField').value.trim(),
    }
    //determines response with headers, and body stringified
    const response = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': 0,
            'Accept': 'application/json'
        },
        body: JSON.stringify(body),
    })
    //determines output based off of status code passed
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
//if submit button pressed, call respective function passing correct parameters
document.getElementById('nameSubmit').addEventListener('click', async (e) => {
    getHeadFun(e, 'nameSubmit', '/api/getCountryName', 'nameOutput');
})
document.getElementById('locationSubmit').addEventListener('click', async (e) => {
    getHeadFun(e, 'locationSubmit', '/api/getCountryLocation', 'locationOutput');
})
document.getElementById('financeSubmit').addEventListener('click', async (e) => {
    getHeadFun(e, 'financeSubmit', '/api/getCountryFinance', 'financeOutput');
})
document.getElementById('allSubmit').addEventListener('click', async (e) => {
    getHeadFun(e, 'allSubmit', '/api/getAllCountries', 'allOutput');
})
document.getElementById('addSubmit').addEventListener('click', async (e) => {
    addFun(e);
})
document.getElementById('editSubmit').addEventListener('click', async (e) => {
    editFun(e);
})