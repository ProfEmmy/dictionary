const form = document.querySelector("form")
const input = document.querySelector(".input-field")
const template = document.querySelector("template")
const result = document.querySelector(".result")
const the_word_div = document.querySelector(".the-word-div")
const the_word = document.querySelector("#word")
const transcription = document.querySelector("#transcription")
const audio = document.querySelector("#audio")
const play_icon = document.querySelector(".play-icon")
const error_div = document.querySelector(".error-div")


form.addEventListener("submit", e => {
    e.preventDefault()

    clearPrevResult()

    const API_URL = generateLink()
    getResults(API_URL)
})

play_icon.addEventListener("click", () => {
    console.log(audio.src)
    audio.play()
})


function clearPrevResult() {
    const children = result.children
    Array.from(children).forEach(child => {
        result.removeChild(child)
    })
}


function generateLink() {
    const input_value = input.value
    const API_URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${input_value}`
    return API_URL
}


function setTheWordText(obj) {
    the_word.innerText = obj.word
}


function set_audiosrc_and_transcription(obj) {
    let audio_src = ""

    if (obj.phonetics[obj.phonetics.length - 1] != undefined) {
        transcription.innerText = obj.phonetics[obj.phonetics.length - 1].text
        audio_src = obj.phonetics[obj.phonetics.length - 1].audio
    } else if (obj.phonetics != undefined && Array.isArray(obj.phonetics) != true) {
        transcription.innerText = obj.phonetics
    } else {
        transcription.innerText = ""
    }

    if (audio_src == "" || audio_src == undefined) {
        audio_src = obj.phonetics[1].audio
    }

    if (audio_src == "" || audio_src == undefined) {
        play_icon.style.display = "none"
    } else {
        play_icon.style.display = "block"
    }

    audio.src = audio_src
}


function setMeanings(meanings) {
    meanings.forEach(meaning => {
        const clone = template.content.cloneNode(true)
        const partOfSpeech = clone.querySelector(".part-of-speech")
        const meanings_list = clone.querySelector(".meaningslist")
        const synonyms_heading = clone.querySelector(".synonyms-heading")
        const antonyms_heading = clone.querySelector(".antonyms-heading")
        const synonyms_collection = clone.querySelector(".synonyms-collection")
        const antonyms_collection = clone.querySelector(".antonyms-collection")
        partOfSpeech.innerText = meaning.partOfSpeech
        const definitions = meaning.definitions
        definitions.forEach(definition => {
            const li = document.createElement("li")
            li.innerText = definition.definition
            meanings_list.appendChild(li)
            const synonyms = definition.synonyms
            if (synonyms.length > 0) {
                synonyms.forEach(synonym => {
                    const new_synonym = document.createElement("p")
                    new_synonym.innerText = synonym
                    synonyms_collection.appendChild(new_synonym)
                })
            } else {
                synonyms_heading.remove()
                synonyms_collection.remove()
            }
            const antonyms = definition.antonyms
            if (antonyms.length > 0) {
                antonyms.forEach(antonym => {
                    const new_antonym = document.createElement("p")
                    new_antonym.innerText = antonym
                    antonyms_collection.appendChild(new_antonym)
                })
            } else {
                antonyms_heading.remove()
                antonyms_collection.remove()
            }
        })
        result.appendChild(clone)
    })
}

async function getResults(url) {
    try {
        const response = await fetch(url)
        console.log(response)
        if (response.ok == false) {
            error_div.classList.remove("display")
            console.log("is not ok")
            the_word_div.classList.add("display")
            input.value = ""
            if (response.status == 404) throw "sorry we couldn't find the word"
        } else {
            error_div.classList.add("display")
            the_word_div.classList.remove("display")
        }
        const data = await response.json()

        data.forEach(d => {
            setTheWordText(d)
            set_audiosrc_and_transcription(d)

            const meanings = d.meanings
            setMeanings(meanings)
        })
    } catch (error) {
        error_div.innerText = error
        error_div.classList.remove("display")
    }
}