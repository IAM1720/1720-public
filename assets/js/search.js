
(function(){
  const input = document.getElementById('contractSearch');
  const results = document.getElementById('searchResults');
  if(!input || !results || !window.CBA_SEARCH_INDEX) return;
  function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function search(q){
    q = q.trim().toLowerCase();
    if(q.length < 2){ results.innerHTML = '<p class="muted">Type at least two characters to search.</p>'; return; }
    const terms = q.split(/\s+/).filter(Boolean);
    const hits = window.CBA_SEARCH_INDEX.map(item => {
      const body = (item.title + ' ' + item.section + ' ' + item.body).toLowerCase();
      let score = 0; terms.forEach(t => { if(body.includes(t)) score += 1; if(item.title.toLowerCase().includes(t)) score += 3; });
      const pos = body.indexOf(terms[0]);
      let snippet = item.body.slice(Math.max(0,pos-90), pos > 0 ? pos+260 : 260);
      return {...item, score, snippet};
    }).filter(x => x.score > 0).sort((a,b) => b.score-a.score).slice(0,20);
    if(!hits.length){ results.innerHTML = '<p>No matches found.</p>'; return; }
    results.innerHTML = hits.map(h => `<div class="result"><a href="${esc(h.url)}">${esc(h.title)}</a><small>${esc(h.section)}</small><p>${esc(h.snippet)}...</p></div>`).join('');
  }
  input.addEventListener('input', () => search(input.value));
  search(input.value);
})();
