
const CHAT_WEBHOOK = "https://tu-n8n.com/webhook/chatbot"; // Reemplaza con tu webhook de n8n

function createChatUI(){
  // Toggle button
  const toggle = document.createElement('button');
  toggle.className = 'chat-toggle';
  toggle.id = 'chat-toggle';
  toggle.innerText = '💬';
  document.body.appendChild(toggle);

  // Chat window
  const win = document.createElement('div');
  win.className = 'chat-window';
  win.id = 'chat-window';
  win.style.display = 'none';

  const msgs = document.createElement('div');
  msgs.className = 'chat-messages';
  msgs.id = 'chat-messages';
  win.appendChild(msgs);

  const inputWrap = document.createElement('div');
  inputWrap.className = 'chat-input';
  const input = document.createElement('input');
  input.id = 'chat-input';
  input.placeholder = 'Escribe tu mensaje...';
  const btn = document.createElement('button');
  btn.id = 'chat-send';
  btn.innerText = 'Enviar';
  inputWrap.appendChild(input);
  inputWrap.appendChild(btn);
  win.appendChild(inputWrap);

  document.body.appendChild(win);

  toggle.addEventListener('click', ()=> {
    win.style.display = win.style.display === 'none' ? 'flex' : 'none';
  });

  btn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e)=> { if(e.key === 'Enter') sendMessage(); });

  function appendMessage(text, who){
    const d = document.createElement('div');
    d.className = who === 'user' ? 'msg-user' : 'msg-bot';
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  async function sendMessage(){
    const text = input.value.trim();
    if(!text) return;
    appendMessage(text, 'user');
    input.value = '';
    try{
      const res = await fetch(CHAT_WEBHOOK, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({message:text})
      });
      const json = await res.json();
      const reply = json.reply || json.answer || "Lo siento, no hay respuesta.";
      appendMessage(reply, 'bot');
    }catch(err){
      appendMessage("Error al conectar con el webhook.", 'bot');
      console.error(err);
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', createChatUI);
