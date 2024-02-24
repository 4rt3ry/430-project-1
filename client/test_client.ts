import axios, { AxiosResponse } from 'axios'

const apiInput = document.querySelector("#api-input") as HTMLInputElement;
const subBtn = document.querySelector("#api-form") as HTMLInputElement;
const content = document.querySelector("#content") as HTMLElement;

const handleResponse = (response: AxiosResponse) => {
    const data = JSON.stringify(response.data, undefined, 4);
    const body = document.createElement("p");
    body.innerHTML = `<pre>${data}</pre>`;
    content.innerHTML = "";
    content.appendChild(body);
}

const setupUI = (): void => {
    
    subBtn.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log(`Requesting ${apiInput.value}`);
        axios.get(`/api/${apiInput.value}`)
        .then(handleResponse)

        return true;
    });
}

setupUI();