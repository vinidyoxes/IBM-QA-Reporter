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
        <div class='header'>
            <span class='stepTitle' >QA Reporter</span>
            <span style="font-size:14px">v1.01</span>
        </div>    
        <div class="floatinIcons">
            <i data-function="list">📄</i>
            <i>📋</i>
        </div>
        <section class="report">        
        <form class="form">
            <div class="step">
                <p class="stepTitle">1.Paste the URL</p>
                <input type="text" id="url" name="url"></input>
            </div>
            <div class="step">
                <p class="stepTitle">2. Select the issue</p>
                <select name="issues" id="issue">
                    <option value="Broken Link">Broken Link</option>
                    <option value="Redirect">Redirect</option>
                    <option value="Video">Broken Video</option>
                    <option value="Image">Broken Image</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="step">
                <p class="stepTitle">3. Description (Optional)</p>

                <input type="text" id="detail" class="input" name="detail">
            </div>
            <div class="step">
                <input type="button" value="Report!" class="button" id="reportButton">
            </div>
        </form>
        </section>
        <section class="currentList">
          <textarea></textarea>  
        </section>

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
            bottom: 12%;
            left: 1%;
            width: 16%; 
            height: auto; 
            display: none;
            flex-direction:column;
            align-items: normal;
            justify-content: space-around;
            background-color: #D7D7D7;
            font-family: "IBM Plex Sans", sans-serif !important;
            padding: 2em 2em;
            row-gap: 3em !important;
            z-index: 9999;
            border-radius:6px;
            
        }

        .menu.dark{
            background:#161616;
            color:#FFF;
        }
        .floatinIcons{
            position:absolute;
             top:5%;
             right:5%;
        }
        .header{ 
            display:flex;
            flex-direction:column;
            align-items:center;
            gap:0.3rem;
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
            transition: transform 0.3s ease; 
            z-index: 999;
        }

        .rotate {
            transform: rotate(45deg); 
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
            width:auto;
            height: 48px; 
            padding: 15px 16px;
            gap: 16px;
            border: 1px solid transparent; 
            opacity: 1; 
        }

        .label {
            font-size: 12px;
            font-weight: 400;
            line-height: 16px;
            letter-spacing: 0.3199999928474426px;
            text-align: left;
        }

        .report{
            display:block;
        }
        .currentList{
            display:none;
        }
    `;

    document.querySelector('body').appendChild(theStyle);

    // IBM Plex Font
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&display=swap');
    document.head.appendChild(link);

    //start the Reporter
    Reporter();

})();