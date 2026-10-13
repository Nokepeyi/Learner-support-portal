"use strict";
export const FALLBACK = [
  { q: "What is 2+2?", a: ["3","4","5","6"], c: 1, d: "a1" },
  { q: "Capital of SA?", a: ["Cape Town","Joburg","Pretoria","Durban"], c: 0, d: "a1" },
  { q: "HTML stands for?", a: ["Hyper Text Markup Language","High Tech","Hyperlink","None"], c: 0, d: "a2" },
];

export function startGame(boxId, qs, onAnswer, onFinish){
  const box = document.getElementById(boxId);
  let i=0, score=0;
  function render(){
    if(i>=qs.length){ onFinish(score, qs.length); return; }
    const q = qs[i];
    box.innerHTML = "";
    const p = document.createElement("p"); p.textContent = `${i+1}. ${q.q}`; box.appendChild(p);
    q.a.forEach((opt, idx)=>{
      const b = document.createElement("button"); b.textContent = opt; b.className="ghost";
      b.onclick = ()=>{ const ok = idx===q.c; if(ok) score++; onAnswer(ok); i++; render(); };
      box.appendChild(b);
    });
  }
  render();
  return { destroy: (clear)=>{ if(clear) box.innerHTML=""; } };
}