const screens=[...document.querySelectorAll('.screen')];
let loadingTimer, answer, sending=false, delivered=false;
function go(id){clearTimeout(loadingTimer);screens.forEach(s=>s.classList.toggle('active',s.id===id));document.querySelectorAll('.progress button').forEach(b=>b.classList.toggle('current',b.dataset.go===id||(id==='reply'&&b.dataset.go==='question')));const title=document.querySelector(`#${id} h1`);title.setAttribute('tabindex','-1');title.focus({preventScroll:true});window.scrollTo({top:0,behavior:'smooth'});}
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
 delivered=true;status.textContent='Your answer has been submitted ♡';
 }catch{status.textContent='Your answer couldn’t be sent. You can try again, or keep going ♡';retry.hidden=false;}
 finally{sending=false;}
}
document.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{if(sending)return;answer=b.dataset.answer;delivered=false;go('reply');void sendAnswer();}));
document.getElementById('retry-email').addEventListener('click',()=>void sendAnswer());
loadingTimer=setTimeout(()=>go('welcome'),3200);
