import links from './data/navLinks.json' assert {type : "json"}
import sosmeds from './data/sosmeds.json' assert {type : "json"}

const navLinks = document.querySelector('#navLinks')
const footerSosmeds = document.querySelector('#footerSosmeds')
const footerLinks = document.querySelector('#footerLinks')
const kucingList = document.querySelector('#kucingList')

const linksElements = links.map(link => (
    `<a href="${link.to}">${link.name}</a>`
)).join('')

navLinks.innerHTML = linksElements
footerSosmeds.innerHTML = sosmeds.join('')
footerLinks.innerHTML = linksElements

const getCatsData = async () => {
    const res = await fetch('https://api.thecatapi.com/v1/breeds?limit=10')
    const catsArr = await res.json()

    const resArr = await Promise.all(catsArr.map(cat => (
        fetch(`https://api.thecatapi.com/v1/images/${cat.reference_image_id}`)
    )))

    const catsArrWithImage = await Promise.all(resArr.map(res => res.json()))

    const filteredData = catsArrWithImage.map(cat => {
        const {id, name, weight, description, origin, life_span, country_code} = cat.breeds[0]
        return {id, name, weight, description, origin, life_span, url: cat.url, country_code}
    })

    return filteredData
}
getCatsData()

const renderKucingList = async () => {
    const catsArr = await getCatsData()

    const catsElements = catsArr.map(cat => {
        const {id, name, weight, description, origin, life_span, url, country_code} = cat
        
        const catCard = `
            <div class='cat-card'>
                <div class='detail'>
                    <img class='main-image' src="${url}" alt="gambar ${name}" />
                    <div class='texts'>
                        <h1>${name}</h1>
                        <div style='display:flex; gap:5px;'>
                            <span style="width: 18px; display: grid; place-content: center;">
                                <i style='color:palevioletred;' class="fa-solid fa-heart-pulse"></i>
                            </span>    
                            <p style='color:palevioletred;'>${life_span}</p>
                        </div>
                        <div style='display:flex; gap:5px;'>
                            <span style="width: 18px; display: grid; place-content: center;">
                                <i style="color:rgb(155, 155, 155);" class="fa-solid fa-weight-scale"></i>
                            </span>    
                            <p style='color:rgb(155, 155, 155)'>${weight.metric} kg</p>
                        </div>
                        <div style='display:flex; gap:5px;'>
                            <span style="width: 18px; display: grid; place-content: center;">
                                <i style='color:rgb(60, 82, 130)' class="fa-sharp fa-solid fa-location-dot"></i>
                            </span>    
                            <img src="https://flagsapi.com/${country_code}/shiny/16.png">
                        </div>
                    </div>
                </div>
                <p class='desc'>${description}</p>
            </div>
        `
        return catCard
    }).join('')

    kucingList.innerHTML = catsElements
}
renderKucingList()
