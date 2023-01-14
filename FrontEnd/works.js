

const responses = await fetch ("http://localhost:5678/api/works");
const works =  await responses.json ();

document.querySelector(".gallery").innerHTML ='';


try {
    responses;

    if (responses.status === 200) {
        genererProjects(works),
        
        console.log("ok");
    } else {
        throw new Error ('Unexpected Error');
    }
} catch (error) {
    console.error(error);
}


function genererProjects(works){
    for (let i = 0; i < works.length; i++) {
        

    const project = works [i];
    const sectionGallery = document.querySelector(".gallery");
      /* fiche projet */
    const workElement = document.createElement("figure");

  /* balises de la fiche */
    const imageElement = document.createElement("img");
        imageElement.src  = project.imageUrl;
        imageElement.crossOrigin = "anonymous";
        imageElement.alt = project.title;

    const titleElement = document.createElement("h2");
        titleElement.innerText = project.title;

    sectionGallery.appendChild(workElement);
    workElement.appendChild(imageElement);
    workElement.appendChild(titleElement);
    
    }
}




        