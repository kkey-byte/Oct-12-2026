const screens=[...document.querySelectorAll('.screen')];
let loadingTimer, answer, sending=false, delivered=false, notYetClicks=0;
function go(id){clearTimeout(loadingTimer);if(id==='question'){notYetClicks=0;const button=document.querySelector('[data-answer=\"not yet\" ]');button.textContent='Not yet';button.classList.remove('playful');}if(id==='surprise')burst();screens.forEach(s=>s.classList.toggle('active',s.id===id));document.querySelectorAll('.progress button').forEach(b=>b.classList.toggle('current',b.dataset.go===id||(id==='reply'&&b.dataset.go==='question')));const title=document.querySelector(`#${id} h1`);title.setAttribute('tabindex','-1');title.focus({preventScroll:true});window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
async function sendAnswer(){
 if(sending||delivered)return;
 sending=true;
 const status=document.getElementById('email-status'),retry=document.getElementById('retry-email');
 retry.hidden=true;status.textContent='Sending your little answer…';
 try{
 const response=await fetch('https://formsubmit.co/ajax/glaisa06292004@gmail.com',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({_subject:'A little smile — someone answered '+answer,_captcha:'false',answer:answer==='yes'?'Yes, you did ♡':'Not yet',message:'Someone answered the question: Did I make you smile even a little?',website:location.origin}),signal:AbortSignal.timeout(15000)});
 const result=await response.json();
 if(!response.ok||!(result.success===true||result.success==='true'))throw new Error('Submission failed');
 delivered=true;status.textContent='';
 }catch{status.textContent='Your answer couldn’t be sent. You can try again, or keep going ♡';retry.hidden=false;}
 finally{sending=false;}
}
document.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{
 if(sending)return;
 if(b.dataset.answer==='not yet'){
  notYetClicks++;
  if(notYetClicks===1){b.textContent='Are you sure? 🥺';return;}
  if(notYetClicks===2){b.textContent='Please reconsider hehe 💗';b.classList.add('playful');return;}
 }
 answer=b.dataset.answer;delivered=false;
 document.getElementById('reply-title').textContent=answer==='yes'?'That little smile made my day ♡':'Then here’s one more little hug ♡';
 document.getElementById('reply-copy').textContent=answer==='yes'?'Mission accomplished. The cat is very proud.':'It’s okay. You don’t have to smile on command. I’m still glad you’re here.';
 go('reply');void sendAnswer();
}));
function burst(){
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const layer=document.createElement('div');layer.className='surprise-burst';layer.setAttribute('aria-hidden','true');
 for(let i=0;i<20;i++){const heart=document.createElement('span');heart.textContent=i%3===0?'✧':'♡';const angle=(i/20)*Math.PI*2;heart.style.setProperty('--x',Math.cos(angle)*(100+Math.random()*160)+'px');heart.style.setProperty('--y',Math.sin(angle)*(100+Math.random()*160)+'px');heart.style.setProperty('--spin',(i%2?1:-1)*80+'deg');layer.append(heart);}
 document.querySelector('.paper').append(layer);setTimeout(()=>layer.remove(),1500);
}
document.getElementById('retry-email').addEventListener('click',()=>void sendAnswer());
loadingTimer=setTimeout(()=>go('welcome'),13000);



