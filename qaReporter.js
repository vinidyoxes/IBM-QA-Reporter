// ==UserScript==
// @name         QA Reporter Beta
// @version      1.0.2
// @description  Just a tool for doing reports!
// @author       Vinicius Ortega <- contact for help
// @match        https://www.ibm.com/*
// @match        http://127.0.0.1:5500/*
// @match        https://author-p131558-e1281329.adobeaemcloud.com/*
// @match        https://wwwstage.ibm.com/*
// @match        https://prod-author.roks.cms.cis.ibm.net/content/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let listSection;
    let reportSection;
    const version = "1.0.1";

    const Reporter = () => {
        
        const menu = document.createElement('div');
        menu.className = 'menu';
        menu.insertAdjacentHTML('afterBegin', `
        <div class='header'>
            <span class='stepTitle' >QA Reporter</span>
            <span style="font-size:14px">v${version}</span>
            <div class="floatinIcons">
            <i data-function="list" class='switcher' >
               <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"/>
                </svg>

            </i> 

            <i class='copyIcon'><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M9 8v3a1 1 0 0 1-1 1H5m11 4h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v1m4 3v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7.13a1 1 0 0 1 .24-.65L7.7 8.35A1 1 0 0 1 8.46 8H13a1 1 0 0 1 1 1Z"/>
                </svg>
            </i>
        </div>
        </div>    
        
        <section class="reportSection">        
        <form class="form">
            <div class="step">
                <p class="stepTitle">1.Paste the URL</p>
                <input data-report-input type="text" id="url" name="url"></input>
            </div>
            <div class="step">
                <p class="stepTitle">2. Select the issue</p>
                <select name="issues" id="issue" data-report-select>
                    <option value="Broken Link">Broken Link</option>
                    <option value="Redirect">Redirect</option>
                    <option value="Video">Broken Video</option>
                    <option value="Image">Broken Image</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="step">
                <p class="stepTitle">3. Description (Optional)</p>

                <input data-report-input type="text" id="detail" class="input" name="detail">
            </div>
            <div class="step">
                <input data-report-button type="button" value="Report!" id="reportButton">
            </div>
        </form>
        </section>
        <section class="listSection input">
            
          
        </section>

        `);
        document.body.insertAdjacentElement('afterend',menu)
        //document.body.appendChild(menu);
        
        reportSection = menu.querySelector('.reportSection');
        listSection = menu.querySelector('.listSection')

        //Report button    
        const reportButton = document.getElementById("reportButton");
        reportButton.onclick = report;

         //Switch Sections
         const iconSwitch = document.querySelector(`.switcher`);
         iconSwitch.classList.add('iconSwitcher')
         if (iconSwitch) {
             iconSwitch.onclick = () => { 
                 
                 reportSection.style.display = (reportSection.style.display == 'block' ? 'none' : 'block')
                                          listSection.style.display = (listSection.style.display == 'none' ? 'flex' : 'none')   
     
             };
         }
     
        const iconCopy = document.querySelector('.copyIcon');
        if (iconCopy) {
            iconCopy.onclick = copyToClipboard;
        } 
        
    };
    

    //Clear inputs
    function clearInputs(){
        document.getElementById("url").value = ""; 
        document.getElementById("issue").selectedIndex = 0;
        document.getElementById("detail").value = "";
    }


    //Define the report text structure
    function logReport(issue, link, description, type, identifier) {
        const typeLabel = type === "heading" ? "Heading" : "CTA";
        const reportedItem = `
        <table>
             <tr>*Issue:* ${issue}\n</tr><br>
             <tr>*${typeLabel}:* ${identifier}\n </tr><br>
             <tr>*URL:* ${link}\n</tr><br>
             <tr>${description !== '' ? `*Description:* ${description}` : '' }</tr><br>
        </table>
            `
        listSection.insertAdjacentHTML('beforeend',reportedItem)
            
    }

    function report(event) {
        event.preventDefault();
        const linkElement = document.querySelector('[name="url"]');
        const link = linkElement.value;
        if (link !== null && link !== "") {
            const elementsWithHref = document.querySelectorAll(`[href="${link}"],[src="${link}"]`);
    
            if (elementsWithHref.length === 0) {
                alert('Link not found');
                return;
            }
    
            elementsWithHref.forEach(card => {
                handleItem(card, link);
            });
        } else {
            alert("Link inválido");
        }
    }
    
    function handleItem(card, link) {
        const issue = document.querySelector('[name="issues"]').value;
        const description = document.querySelector('[name="detail"]').value;
        const identifier = function(){
            //Skip the QA Helper text
           let componentText = card.textContent.trim()
            let componentHelperTextRemover = componentText.split("•")[0];
            console.log(componentHelperTextRemover);
            return componentHelperTextRemover
        }

        logReport(issue, link, description, "element", identifier());
        clearInputs();
    }
    

    

    function copyToClipboard() {
        const textToCopy = listSection.innerText.replace(/\n\n/g, '\n'); 
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                alert('Text copied to clipboard!');
            })
            .catch((error) => {
                alert('Failed to copy', error);
            });
    }

    // Expand button
    const expandBtn = document.createElement('div');
    expandBtn.classList.add('expandIcon');
    expandBtn.textContent = '+';
    document.body.appendChild(expandBtn);
    expandBtn.onclick = function() {
        const menu = document.querySelector('.menu');
        menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'flex' : 'none';
        expandBtn.classList.toggle('rotate');
        
    };

    
    


        // IBM Plex Font
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&display=swap');
        document.head.appendChild(link);
    
        
        // Styling elements
    const Style = document.createElement('STYLE');
    Style.innerHTML = `

        .menu {
            position: fixed;
            bottom: 12%;
            left: 1%;
            width: 16%; 
            max-height: 80%; 
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
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
            
        }

        .menu.dark{
            background:#161616;
            color:#FFF;
        }

        .listSection{
            display: none;
            flex-direction:column;
            overflow-y: scroll;
            overflow-x: hidden;
            max-height:40vh;
            background-color:#FFF;
            
        }

        .reportSection{
         display:block;
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

        [data-report-button] {
            background-color: #0F62FE;
            color: white;
            border: none;
            padding: 15px 20px;
            font-weight: bold;
        }

        [data-report-button]:hover {
            cursor: pointer;
            background-color: #0050E6;
        }

        [data-report-input], [data-report-select] {
            width:auto;
            height: 48px; 
            padding: 15px 16px;
            gap: 16px;
            border: 1px solid transparent; 
            opacity: 1; 
            background-color:white;
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

        .floatinIcons i{
          cursor:pointer;
            user-select: none;
            
        }

        .floatinIcons i:hover{
            color:#0050E6;
        }

   
    `;

    document.querySelector('body').appendChild(Style);

    //start the Reporter
    setTimeout(Reporter(),1000)

})();