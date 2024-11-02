// ==UserScript==
// @name         QA Reporter
// @version      0.1.1
// @description  Just a helper for doing reports!
// @author       Vinicius Ortega <- contact any of us for help
// @match        https://www.ibm.com/*
// @match        http://127.0.0.1:5500/*
// @match        https://author-p131558-e1281329.adobeaemcloud.com/*
// @match        https://prod-author.roks.cms.cis.ibm.net/content/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const Reporter = () => {
        const menu = document.createElement('div');
        menu.className = 'menu';

        menu.insertAdjacentHTML('afterBegin', `
        <form class="form">
            <div class="step">
                <p class="stepTitle">1. Step one</p>
                <label for="url">Paste the URL</label>
                <input type="text" id="url" name="url"></input>
            </div>
            <div class="step">
                <p class="stepTitle">2. Select the issue</p>
                <label for="issues">Select an issue:</label>
                <select name="issues" id="issue">
                    <option value="Broken Link">Broken Link</option>
                    <option value="Redirect">Redirect</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="step">
                <p class="stepTitle">3. Description (Optional)</p>
                <label for="detail">Select an issue:</label>

                <input type="text" id="detail" class="input" name="detail">
            </div>
            <div class="step">
                <p class="stepTitle">4. Press REPORT</p>
                <input type="button" value="Report!" class="button" id="reportButton">
            </div>
        </form>
        `);
        document.body.appendChild(menu);

        // Adiciona o evento de clique ao botão de relatório
        const reportButton = document.getElementById("reportButton");
        reportButton.onclick = report;
    };

    //Clear inputs
    function clearInputs(){
        document.getElementById("url").value = ""; //
        document.getElementById("issue").selectedIndex = 0;
        document.getElementById("detail").value = "";
    }

    //Define the report text structure
    function logReport(issue, link, description, type, identifier) {
        const typeLabel = type === "heading" ? "Heading" : "CTA";
        console.log(`
            Report submitted!\n
            *Issue:* ${issue}\n
            *${typeLabel}:* ${identifier}\n
            *URL:* ${link}\n
            ${description !== '' ? `*Description:* ${description}` : ''}`);
    }

    function report(event) {
        console.log('clicou');
        event.preventDefault();
    
        // Get the URL input value
        const linkElement = document.querySelector('[name="url"]');
        const link = linkElement.value;
    
        // Verifica se o link não é nulo nem vazio
        if (link !== null && link !== "") {
            const elementsWithHref = document.querySelectorAll(`[href="${link}"]`);
            console.log(elementsWithHref);
    
            if (elementsWithHref.length === 0) {
                alert('Link not found');
                return;
            }
    
            // Itera sobre todos os elementos encontrados com o mesmo href
            elementsWithHref.forEach(card => {
                handleItem(card, link); // Passa o link aqui
            });
        } else {
            alert("Link inválido");
        }
    }
    
    function handleItem(card, link) {
        const issue = document.querySelector('[name="issues"]').value;
        const description = document.querySelector('[name="detail"]').value;
    
        // Pega qualquer texto dentro do elemento
        const identifier = card.textContent.trim();
    
        // Loga o relatório para cada elemento encontrado
        logReport(issue, link, description, "element", identifier);
        clearInputs();
    }
    

    // Cria a estrutura da lista de relatórios
    const notificationIcon = document.createElement('div');
    notificationIcon.classList.add('expandIcon');
    notificationIcon.textContent = '+'; // Ícone de copiar
    document.body.appendChild(notificationIcon);

    // Adiciona funcionalidade para expandir/recolher a lista
    notificationIcon.onclick = function() {
        const menu = document.querySelector('.menu');
        menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'flex' : 'none';
        notificationIcon.classList.toggle('rotate');
    };

    const theStyle = document.createElement('STYLE');

    // Styling elements
    theStyle.innerHTML = `
        * {
            padding: 0;
            margin: 0;
        }

        .menu {
            position: fixed;
            bottom: 10%;
            left: 1%;
            width: auto; /* Alterado para auto para o ajuste dinâmico */
            height: auto; /* Alterado para auto para o ajuste dinâmico */
            display: none;
            align-items: center;
            justify-content: center;
            background-color: #D7D7D7;
            font-family: "IBM Plex Sans", sans-serif !important;
            padding: 2em 4em;
            row-gap: 1em !important;
            z-index: 9999;
        }

        .form {
            display: flex;
            gap: 1rem;
            flex-direction: column;
        }

        .expandIcon {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            font-weight: 900;
            background-color: #0F62FE;
            width: 50px;
            height: 50px;
            text-align: center;
            border-radius: 100%;
            color: white;
            cursor: pointer;
            user-select: none;
            position: fixed;
            bottom: 5%;
            left: 1%;
            transition: transform 0.3s ease; /* Suaviza a rotação */
            z-index: 999;
        }

        .rotate {
            transform: rotate(45deg); /* Define a rotação para 45 graus */
        }

        .stepTitle {
            font-weight: bold;
        }

        .step {
            display: flex;
            flex-direction: column;
            gap: 0;
        }

        .button {
            background-color: #0F62FE;
            color: white;
            border: none;
            padding: 15px 20px;
            font-weight: bold;
        }

        .button:hover {
            cursor: pointer;
            background-color: #0050E6;
        }

        input, select {
            height: 48px; /* Corrigido */
            padding: 15px 16px;
            gap: 16px;
            border: 1px solid transparent; /* Corrigido para bordas */
            opacity: 1; /* Corrigido para visibilidade */
        }

        .label {
            font-size: 12px;
            font-weight: 400;
            line-height: 16px;
            letter-spacing: 0.3199999928474426px;
            text-align: left;
        }
    `;

    document.querySelector('body').appendChild(theStyle);

    // Importando a fonte IBM
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&display=swap');
    document.head.appendChild(link);

    //start the Reporter
    Reporter();

})();