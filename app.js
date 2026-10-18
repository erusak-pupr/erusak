(() => {
  const cfg = window.SITE_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const els = {total:$("total"), followup:$("followup"), updated:$("updated"), rows:$("rows"), message:$("message"), search:$("search"), district:$("district"), status:$("status")};
  let all = [];
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function parseCSV(text) {
    const out=[]; let row=[], cell="", quoted=false;
    for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];
      if(c === '"' && quoted && n === '"'){cell+='"';i++;}
      else if(c === '"') quoted=!quoted;
      else if(c === ',' && !quoted){row.push(cell);cell="";}
      else if((c === '\n' || c === '\r') && !quoted){if(c==='\r'&&n==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))out.push(row);row=[];cell="";}
      else cell+=c;
    }
    if(cell.length||row.length){row.push(cell);out.push(row);}
    if(!out.length)return [];
    const headers=out.shift().map(h=>h.trim().replace(/^\uFEFF/,"").toLowerCase());
    return out.map(r=>Object.fromEntries(headers.map((h,i)=>[h,(r[i]||"").trim()])));
  }
  const get = (r,...names) => {for(const n of names){const k=n.toLowerCase();if(r[k])return r[k];}return ""};
  function populate(select, values, label){const prior=select.value;select.innerHTML=`<option value="">${label}</option>`+[...new Set(values.filter(Boolean))].sort().map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join("");select.value=prior;}
  function render(){
    const q=els.search.value.trim().toLowerCase(), d=els.district.value, s=els.status.value;
    const data=all.filter(r=>{
      const name=get(r,"nama bangunan","nama"), kel=get(r,"kelurahan"), kec=get(r,"kecamatan"), stat=get(r,"status ringkas","status");
      return (!q||`${name} ${kel} ${kec}`.toLowerCase().includes(q))&&(!d||kec===d)&&(!s||stat===s);
    });
    els.rows.innerHTML=data.length?data.map(r=>{
      const name=get(r,"nama bangunan","nama")||"—", kec=get(r,"kecamatan"), kel=get(r,"kelurahan"), stat=get(r,"status ringkas","status")||"—", date=get(r,"tanggal data","tanggal"), link=get(r,"tautan foto","dokumentasi");
      let safeLink="";
      try{const u=new URL(link);if(u.protocol==="https:")safeLink=u.href;}catch(e){}
      return `<tr><td>${esc(name)}</td><td>${esc([kel,kec].filter(Boolean).join(", ")||"—")}</td><td>${esc(stat)}</td><td>${esc(date||"—")}</td><td>${safeLink?`<a href="${esc(safeLink)}" target="_blank" rel="noopener noreferrer">Lihat dokumentasi</a>`:"—"}</td></tr>`;
    }).join(""):`<tr><td colspan="5">Tidak ada data yang cocok.</td></tr>`;
  }
  async function load(){
    if(!cfg.publicCsvUrl){els.message.textContent="Belum terhubung ke CSV publik. Ikuti README untuk menyiapkan sheet publik terpisah.";return;}
    els.message.textContent="Memuat data publik…";
    try{
      const res=await fetch(cfg.publicCsvUrl,{cache:"no-store"});
      if(!res.ok)throw new Error("CSV tidak dapat diakses");
      all=parseCSV(await res.text());
      // Data yang ditampilkan harus memang sudah disaring di sheet publik. Jangan mengandalkan filter ini sebagai kontrol keamanan.
      els.total.textContent=all.length.toLocaleString("id-ID");
      const statuses=all.map(r=>get(r,"status ringkas","status"));
      els.followup.textContent=statuses.filter(s=>(cfg.followUpStatuses||[]).includes(s)).length.toLocaleString("id-ID");
      els.updated.textContent=new Date().toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"});
      populate(els.district,all.map(r=>get(r,"kecamatan")),"Semua kecamatan");
      populate(els.status,statuses,"Semua status");
      els.message.textContent=`Data publik berhasil dimuat (${all.length} baris).`;
      render();
    }catch(e){els.message.textContent="Data belum dapat dimuat. Periksa URL CSV publik dan pengaturan publikasinya.";els.rows.innerHTML='<tr><td colspan="5">Data tidak tersedia.</td></tr>';}
  }
  [els.search,els.district,els.status].forEach(el=>el.addEventListener("input",render));
  $("reload").addEventListener("click",load);
  load();
})();
