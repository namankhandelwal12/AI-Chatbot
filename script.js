let prompt=document.querySelector("#prompt")
let submit=document.querySelector("#submit")
let chatContainer=document.querySelector(".chat-container")
let imagebtn=document.querySelector("#image")
let image=document.querySelector("#image img")
let imageinput=document.querySelector("#image input")

const API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyCAT-bDpJQd4qry617VcjinNPjIQH9qKMs";
let user={
    message:null,
    file:{
        mime_type: null,
            data: null
    }
}

async function generateResponse(aiChatBox){
    let text=aiChatBox.querySelector(".ai-chat-area")
    let RequestOptions={
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({"contents": [
            {"parts": [{"text": `
                        IMPORTANT:
                        You must respond ONLY in bullet points.
                        Do NOT write paragraphs.
                        Each bullet must be on a new line.
                        No explanations outside bullet points.
                        No headings.
                        Use this exact format:
                        - point 1
                        - point 2
                        - point 3
                        
                        If the query is related to the image provided, analyze the image and provide relevant information.
                        If no image is provided, answer based solely on the text query.
                        Query: ${user.message}`}, (user.file.data?[{"inline_data": user.file}]:[])]
            }
        ]
        })
    }
    try{
        let response=await fetch(API_URL,RequestOptions)
        let data=await response.json()
        let apiResponse = data.candidates[0].content.parts[0].text;
        // convert everything to bullets (super simple)
        let bullets = apiResponse
        .split("\n")
        .filter(line => line.trim() !== "")
        .map(line => "• " + line.replace(/^[-•]\s*/, ""))
        .join("<br>");
        text.innerHTML = bullets;
        
    }
    catch(error){
        console.error(error);
}
    finally{
        chatContainer.scrollTo({top: chatContainer.scrollHeight, behavior: "smooth"})
        image.src= `img.svg`
        image.classList.remove("choose")
        user.file={}
    }
}
function createChatBox(html,classes){
    let div=document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
}


function handlechatResponse(message){
    user.message=message
    let html=`<img src="user.png" alt="" id="userImage" width="8%">
            <div class="user-chat-area">
            ${user.message}
            ${user.file.data? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg"/>`:""}

            </div>`
            prompt.value=""
            let userChatBox=createChatBox(html,"user-chat-box")
            chatContainer.appendChild(userChatBox)
            chatContainer.scrollTo({top: chatContainer.scrollHeight, behavior: "smooth"})

            setTimeout(()=>{
                let html=`<img src="ai.png" alt="" id="aiImage" width="9%">
            <div class="ai-chat-area">
                <img class="load" src="load.gif" alt="" width="50px"> 
            </div>`
            let aiChatBox=createChatBox(html,"ai-chat-box")
            chatContainer.appendChild(aiChatBox)
            generateResponse(aiChatBox)

},600)
}
prompt.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        handlechatResponse(prompt.value)

    }
})
imageinput.addEventListener("change",()=>{
    const file=imageinput.files[0]
    if(!file) return
    let reader=new FileReader()
    reader.onload=(e)=>{
        let base64string=e.target.result.split(",")[1]
        user.file={
                mime_type: file.type,
                data: base64string
        }
    image.src= `data:${user};base64,${user.file.data}`
    image.classList.add("choose")
    }
    reader.readAsDataURL(file)
})
imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click()
})