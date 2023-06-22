const form = document.querySelector("form")
const input = document.querySelector(".input-field")
const template = document.querySelector("template")
const result = document.querySelector(".result")
const the_word = document.querySelector("#word")
const transcription = document.querySelector("#transcription")
const audio = document.querySelector("#audio")
const play_icon = document.querySelector(".play-icon")

let audio_src = ""

form.addEventListener("submit", e => {
    e.preventDefault()
    const children = result.children
    Array.from(children).forEach(child => {
        result.removeChild(child)
    })
    const input_value = input.value
    const API_URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${input_value}`
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            data.forEach(d => {
                the_word.innerText = d.word
                if (d.phonetics[d.phonetics.length - 1] != undefined) {
                    transcription.innerText = d.phonetics[d.phonetics.length - 1].text
                    audio_src = d.phonetics[d.phonetics.length - 1].audio
                } else if (d.phonetics != undefined && Array.isArray(d.phonetics) != true) {
                    transcription.innerText = d.phonetics
                } else {
                    transcription.innerText = ""
                }
                if (audio_src == "" || audio_src == undefined) {
                    audio_src = d.phonetics[1].audio
                }

                audio.src = audio_src

                const meanings = d.meanings
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
            })
        })

    play_icon.style.display = "block"
})

play_icon.addEventListener("click", () => {
    console.log(audio_src)
    console.log(audio.src)
    audio.play()
})