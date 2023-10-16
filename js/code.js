"use strict"



/*----- Routing Management -----*/

let homePage = "../articoli.json";

let mediaPage = "../video.json";

let routes = {
    '/': homePage,
    '/media': mediaPage
};

window.onpopstate = () => {
    let route = window.location.pathname;

    console.log("route: " + route);

    if(route == '/index.html')
        route = "/";
        
    
    resetSection();
    changeTitle(route);
    loadExternalData(routes[route]);
}
  
let onNavItemClick = (pathName) => {
    window.history.pushState({}, pathName, window.location.origin + pathName);
    resetSection();
    changeTitle(pathName);
    loadExternalData(routes[pathName]);
}

let loadInternalData = () => {
    let route = window.location.pathname;

    console.log("route: " + route);

    if(route == '/index.html')
        route = "/";
  
    
    resetSection();
    changeTitle(route);
    loadExternalData(routes[route]);
}

let resetSection = () => {
    let contentDiv = document.querySelector(".section");
    contentDiv.innerHTML = "";
}

let changeTitle = (newTitle) => {

    if(newTitle == "/")
        newTitle = "Home"
    else if(newTitle == "/media")
        newTitle = "Video"

    document.title = "My Compani - " + newTitle;
}


let lettersCounter = 0;
let timerId = null;
let word = "";


function pageLoaded()
{
    loadInternalData();
}


window.onload = () => pageLoaded();



/* HamburgerIcon */

function changeHamburgerIcon()
{
    let hamburgerContainer = document.getElementById("hamburgerContainer");
    
    hamburgerContainer.classList.toggle("changeHamburgerIcon");
}

function setInnerNavbarVisibility()
{
    let innerNavbarContainer = document.getElementById("innerNavbarContainer");

    if(innerNavbarContainer.classList.contains("showInnerNavbar"))
    {
        innerNavbarContainer.classList.remove("showInnerNavbar");
        innerNavbarContainer.classList.add("hideInnerNavbar");
    }
    else 
    {
        innerNavbarContainer.classList.remove("hideInnerNavbar");
        innerNavbarContainer.classList.add("showInnerNavbar");
    }
}

/*--- Create Article ---*/

function createArticle(h2Text, h5Text, imgDiv, paragraphs)
{
    const article = document.createElement('article');
    const h2 = document.createElement('h2');
    const h5 = document.createElement('h5');
    const div = document.createElement('div');
    const ps = []

    for(let i = 0; i < paragraphs.length; i++)
    {
        const paragraph = document.createElement('p');
        ps[i] = paragraph;
        paragraph.textContent = paragraphs[i];
    }

    
    h2.textContent = h2Text; 
    h5.textContent = h5Text; 
    div.innerHTML = imgDiv;
    
    div.className = "imageContainer";

    article.append(h2);
    article.append(h5);
    article.append(div);

    for(let i = 0; i < ps.length; i++)
    {
        article.append(ps[i]);
    }

    return article;
}


/*---Managing external data loading---*/

function loadExternalData(path)
{

    let fetchPromise = fetch(path)

    fetchPromise.then(function(response)
    {
        console.log("response.headers: " + response.headers);

        for(let [headerKey, headerValue] of response.headers)
        {
        console.log(`${headerKey} = ${headerValue}`);
        }

        console.log("response.ok: " + response.ok);
        console.log("response.redirected: " + response.redirected);
        console.log("response.status: " + response.status);
        console.log("response.statusText: " + response.statusText);
        console.log("response.type: " + response.type); //if cors, response was received from a valid cross-origin request.
        console.log("response.url: " + response.url);

        //console.log("response.body: " + response.body);
        //console.log("response.bodyUsed: " + response.bodyUsed);

        if(response.ok)
        {
            console.log("response.bodyUsed: " + response.bodyUsed);

            let jsonPromise = response.json();

            console.log("jsonPromise: " + jsonPromise);
            console.log(jsonPromise);

            console.log("response.bodyUsed: " + response.bodyUsed);

            return jsonPromise;
        }
        
        return Promise.reject(new Error("Problema!"));
    })
    .then(function(jsonObject)
    {
        console.log("jsonObject: " + jsonObject);
        console.log("JSON.stringify(jsonObject): " + JSON.stringify(jsonObject));

        createArticles(jsonObject);
        
    })
    .catch(function(error)
    {
        console.log("error!!!: " + error);
    });

    console.log(fetchPromise);
}

function createArticles(jsonObject)
{
    console.log("costruisciArticoli().");
    
    const articlesObj = jsonObject.articoli;

    console.dir("articlesObj: " + articlesObj);
    console.dir("articlesObj.length: " + articlesObj.length);

    const currentSection = document.querySelector(".section");

    for (let i = 0; i < articlesObj.length; i++)
    {
        const articleObj = articlesObj[i];

        console.dir("articleObj: " + articleObj);

        for(let i in articleObj )
        {
            console.dir(i + " = " + articleObj[i]);
            console.dir(articleObj[i] + " = " + typeof(articleObj[i]));
        }
        const newArticle = createArticle2(articleObj.h2Text,
                                        articleObj.h5Text,
                                        articleObj.imgPath,
                                        articleObj.imgAlt,
                                        articleObj.paragraphs,
                                        articleObj.mediaType);

        if(articleObj.isBefore == true)
        {
            const currentForm = document.querySelector(".flexForm");
            currentForm.before(newArticle);
        }
        else
            currentSection.prepend(newArticle);

    }
}

function createArticle2(h2Text, h5Text, imgPath, imgAlt, paragraphs, mediaType)
{
    const article = document.createElement('article');
    const h2 = document.createElement('h2');
    const h5 = document.createElement('h5');
    const div = document.createElement('div');
    const ps = []

    for(let i = 0; i < paragraphs.length; i++)
    {
        const paragraph = document.createElement('p');
        ps[i] = paragraph;
        paragraph.textContent = paragraphs[i];
    }

    h2.textContent = h2Text; 
    h5.textContent = h5Text;
    
    if(mediaType == "image")
        div.innerHTML = "<img src=\"" + imgPath + "\" alt=\"" + imgAlt + "\"" + "class=\"responsiveImage\">";
    else if(mediaType == "video")
        div.innerHTML = `<video controls autoplay="true" muted="false" class="responsiveImage">
                            <source src=${imgPath} type="video/mp4">
                            Il tuo browser non supporta video.
                        </video>`;
    else
        div.innerHTML = "Content not defined."
    
    div.className = "imageContainer";

    article.append(h2);
    article.append(h5);
    article.append(div);

    for(let i = 0; i < ps.length; i++)
    {
        article.append(ps[i]);
    }

    return article;
}