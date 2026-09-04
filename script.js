let currentMode = 'chat';

// Switch Modes (Chat, Image, Video, Audio)
function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  
  const mediaRow = document.getElementById('mediaControls');
  mediaRow.style.display = (mode === 'image' || mode === 'video' || mode === 'audio') ? 'grid' : 'none';
}

// Deep Links to Open Apps Directly
function openApp(target) {
  if (target === 'youtube') window.location.href = "vnd.youtube://";
  else if (target === 'whatsapp') window.location.href = "whatsapp://";
  else if (target === 'github') window.open("https://github.com", "_blank");
  else if (target === 'camera') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.click();
  }
}

// Speech Recognition (Voice Input)
function startVoice() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert("Voice input is not supported in this browser. Please use Chrome.");
    return;
  }
  const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new Speech();
  rec.lang = 'en-US';
  rec.start();
  rec.onresult = (e) => {
    document.getElementById('mainPrompt').value = e.results[0][0].transcript;
    runGKEditAI();
  };
}

// Text-to-Speech Output
function speak(txt) {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(txt);
    window.speechSynthesis.speak(utter);
  }
}

// Multi-Modal Generator (No API Key Required)
async function runGKEditAI() {
  const prompt = document.getElementById('mainPrompt').value.trim();
  const box = document.getElementById('displayBox');
  const btn = document.getElementById('runBtn');
  if (!prompt) return;

  btn.innerText = "Processing...";
  btn.disabled = true;
  box.innerHTML = `<span style="color: var(--text-dim);">GKEDIT AI is generating...</span>`;

  try {
    // Image Generation with Aspect Ratio
    if (currentMode === 'image') {
      const ratio = document.getElementById('aspectRatio').value;
      const dims = ratio === '16:9' ? '1280x720' : (ratio === '9:16' ? '720x1280' : '1024x1024');
      const [w, h] = dims.split('x');
      const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${w}&height=${h}&nologo=true&seed=${Math.floor(Math.random() * 999999)}`;
      box.innerHTML = `<div><b>Generated Image (${ratio}):</b><br/><img src="${imgUrl}" alt="GKEDIT AI Output" /></div>`;
    } 
    // Video and Music Mock Render Output
    else if (currentMode === 'video' || currentMode === 'audio') {
      const ratio = document.getElementById('aspectRatio').value;
      const duration = document.getElementById('durationLimit').value;
      box.innerHTML = `
        <div>
          <b>[GKEDIT AI Multi-Modal Engine]</b><br/>
          - <b>Mode:</b> ${currentMode.toUpperCase()}<br/>
          - <b>Prompt:</b> "${prompt}"<br/>
          - <b>Aspect Ratio:</b> ${ratio}<br/>
          - <b>Duration:</b> ${duration}s<br/><br/>
          <i>Render complete.</i>
        </div>`;
    } 
    // Free AI Chat & Analysis
    else {
      const systemPrompt = "You are GKEDIT AI, an intelligent multi-modal assistant and Gemini rival created by youtuber @GKEDIT2141. Give helpful, sharp answers.";
      const fullPrompt = `${systemPrompt} Question: ${prompt}`;
      
      const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}`);
      const reply = await res.text();
      
      box.innerText = reply;
      speak(reply);
    }
  } catch (err) {
    box.innerHTML = `<span style="color: #ef4444;">Error: ${err.message}</span>`;
  } finally {
    btn.innerText = "Execute";
    btn.disabled = false;
  }
}
