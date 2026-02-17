"use client";
import { useState, useMemo } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  // Orange-600 primary
  primary:     "#ea580c",
  primaryHov:  "#c2410c",
  primaryLight:"#fff7ed",
  primaryMid:  "#fed7aa",
  primaryBorder:"#fb923c",

  // Page surfaces
  bg:          "#fafaf9",
  surface:     "#ffffff",
  surfaceAlt:  "#fafaf9",
  sidebar:     "#1c1917",
  sidebarHov:  "#292524",
  sidebarText: "#d6d3d1",
  sidebarActive:"#ea580c",

  // Borders
  border:      "#e7e5e4",
  borderMid:   "#d6d3d1",

  // Text
  text:        "#1c1917",
  textMid:     "#57534e",
  textSoft:    "#a8a29e",
  textXsoft:   "#d6d3d1",

  // Status colors (warm tones)
  processing:  { color:"#d97706", bg:"#fffbeb", border:"#fde68a", light:"#fef3c7" },
  shipped:     { color:"#0284c7", bg:"#f0f9ff", border:"#bae6fd", light:"#e0f2fe" },
  delivered:   { color:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0", light:"#dcfce7" },
  cancelled:   { color:"#dc2626", bg:"#fef2f2", border:"#fecaca", light:"#fee2e2" },
  returns:     { color:"#7c3aed", bg:"#faf5ff", border:"#ddd6fe", light:"#ede9fe" },
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CUSTOMERS = [
  { name:"Sarah Chen",       email:"sarah.chen@email.com",    phone:"+1 (415) 234-5678" },
  { name:"Marcus Johnson",   email:"marcus.j@gmail.com",      phone:"+1 (212) 345-6789" },
  { name:"Priya Patel",      email:"priya.patel@corp.com",    phone:"+1 (312) 456-7890" },
  { name:"Tyler Brooks",     email:"tbrooks@outlook.com",     phone:"+1 (617) 567-8901" },
  { name:"Amira Nasser",     email:"amira.n@yahoo.com",       phone:"+1 (713) 678-9012" },
  { name:"Leo Schmidt",      email:"leo.schmidt@web.de",      phone:"+49 171 234 5678"  },
  { name:"Yuki Tanaka",      email:"yuki.t@mail.jp",          phone:"+81 90 1234 5678"  },
  { name:"Carmen Rivera",    email:"carmen.r@email.es",       phone:"+34 612 345 678"   },
  { name:"James O'Brien",    email:"jamesobrien@eircom.net",  phone:"+353 87 123 4567"  },
  { name:"Fatima Al-Rashid", email:"fatima.ar@gmail.com",     phone:"+971 50 123 4567"  },
];
const PRODUCTS = [
  { name:"Wireless Pro Headphones X1",  sku:"WPH-X1-BLK" },
  { name:"Smart Watch Series 5",        sku:"SW-S5-SLV"   },
  { name:"Mechanical Keyboard TKL",     sku:"MK-TKL-RGB"  },
  { name:'4K Ultra Monitor 27"',        sku:"MON-4K-27"   },
  { name:"Portable SSD 2TB",            sku:"SSD-2TB-USB" },
  { name:"Ergonomic Mouse Pro",         sku:"EM-PRO-WL"   },
  { name:"USB-C Hub 12-in-1",           sku:"HUB-12C-GRY" },
  { name:"Webcam 4K AutoFocus",         sku:"CAM-4K-AF"   },
  { name:"Noise Cancel. Earbuds",       sku:"NCE-BT-WHT"  },
  { name:"Laptop Stand Adjustable",     sku:"LS-ADJ-ALU"  },
  { name:"Gaming Controller Elite",     sku:"GC-ELITE-BLK"},
  { name:"Smart Speaker Mini",          sku:"SS-MINI-GRY" },
];
const S_POOL = ["processing","processing","shipped","shipped","delivered","delivered","delivered","cancelled","returns"];
const ADDRS = [
  { address:"742 Evergreen Terrace",     city:"Springfield, IL", zip:"62701" },
  { address:"350 Fifth Avenue, Apt 12B", city:"New York, NY",    zip:"10118" },
  { address:"1 Infinite Loop",           city:"Cupertino, CA",   zip:"95014" },
  { address:"55 Water Street",           city:"New York, NY",    zip:"10041" },
  { address:"100 Main Street",           city:"Austin, TX",      zip:"73301" },
];
function mkDate(days){ const d=new Date(); d.setDate(d.getDate()-days); return d.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}); }
function genOrders(n=150){
  return Array.from({length:n},(_,i)=>({
    id:`ORD-${10000+i}`,
    customer:CUSTOMERS[i%CUSTOMERS.length].name,
    email:CUSTOMERS[i%CUSTOMERS.length].email,
    phone:CUSTOMERS[i%CUSTOMERS.length].phone,
    product:PRODUCTS[i%PRODUCTS.length].name,
    sku:PRODUCTS[i%PRODUCTS.length].sku,
    date:mkDate(i%90),
    total:parseFloat((15+(i*37.3+12.7)%485).toFixed(2)),
    items:(i%4)+1,
    status:S_POOL[i%S_POOL.length],
    address:ADDRS[i%ADDRS.length].address,
    city:ADDRS[i%ADDRS.length].city,
    zip:ADDRS[i%ADDRS.length].zip,
    country:"United States",
    tracking:(S_POOL[i%S_POOL.length]==="shipped"||S_POOL[i%S_POOL.length]==="delivered")?`1Z999AA${10000000+i}`:null,
    notes:i%7===0?"Customer requested express delivery":"",
  }));
}

const SC = {
  processing: { label:"Processing", icon:"⚙️", ...C.processing },
  shipped:    { label:"Shipped",    icon:"🚚", ...C.shipped    },
  delivered:  { label:"Delivered",  icon:"✅", ...C.delivered  },
  cancelled:  { label:"Cancelled",  icon:"✕",  ...C.cancelled  },
  returns:    { label:"Return",     icon:"↩",  ...C.returns    },
};

// ─── STAT CARDS ───────────────────────────────────────────────────────────────
function OrderStats({ orders, onFilter, activeFilter }) {
  const counts = useMemo(()=>{
    const c={all:orders.length};
    Object.keys(SC).forEach(k=>{c[k]=orders.filter(o=>o.status===k).length;});
    return c;
  },[orders]);

  const data=[
    { label:"All Orders",  key:"all",        icon:"📦", accent:C.primary,         accentBg:C.primaryLight, trend:"+12%" },
    { label:"Processing",  key:"processing",  icon:"⚙️", accent:C.processing.color, accentBg:C.processing.bg, trend:"+5%"  },
    { label:"Shipped",     key:"shipped",     icon:"🚚", accent:C.shipped.color,   accentBg:C.shipped.bg,    trend:"+8%"  },
    { label:"Delivered",   key:"delivered",   icon:"✅", accent:C.delivered.color, accentBg:C.delivered.bg,  trend:"+18%" },
    { label:"Cancelled",   key:"cancelled",   icon:"✕", accent:C.cancelled.color, accentBg:C.cancelled.bg,  trend:"-3%"  },
    { label:"Returns",     key:"returns",     icon:"↩", accent:C.returns.color,   accentBg:C.returns.bg,    trend:"+2%"  },
  ];

  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:"14px",marginBottom:"22px"}}>
      {data.map((s,i)=>{
        const isActive = activeFilter === s.key;
        return (
          <div key={s.key} onClick={()=>onFilter(s.key)} style={{
            background: isActive ? s.accentBg : C.surface,
            border: `2px solid ${isActive ? s.accent : C.border}`,
            borderRadius:"14px", padding:"18px 16px", cursor:"pointer",
            transition:"all 0.2s ease", position:"relative", overflow:"hidden",
            boxShadow: isActive ? `0 4px 16px ${s.accent}20` : "0 1px 3px rgba(0,0,0,0.06)",
            animation:`fuL 0.4s ease ${i*55}ms both`,
          }}
            onMouseEnter={e=>{if(!isActive){e.currentTarget.style.borderColor=s.accent;e.currentTarget.style.boxShadow=`0 4px 14px ${s.accent}18`;e.currentTarget.style.transform="translateY(-2px)";}}}
            onMouseLeave={e=>{if(!isActive){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.06)";e.currentTarget.style.transform="none";}}}
          >
            {isActive && <div style={{position:"absolute",top:0,left:0,right:0,height:"3px",background:s.accent,borderRadius:"14px 14px 0 0"}}/>}
            <div style={{fontSize:"22px",marginBottom:"8px",lineHeight:1}}>{s.icon}</div>
            <div style={{fontSize:"28px",fontWeight:"800",color:s.accent,fontFamily:"'DM Mono',monospace",letterSpacing:"-1.5px",lineHeight:1}}>
              {(counts[s.key]||0).toLocaleString()}
            </div>
            <div style={{fontSize:"11px",color:C.textMid,marginTop:"5px",fontWeight:"600",textTransform:"uppercase",letterSpacing:"0.06em"}}>{s.label}</div>
            <div style={{fontSize:"10px",color:s.trend.startsWith("+")?C.delivered.color:C.cancelled.color,marginTop:"5px",fontWeight:"700"}}>
              {s.trend} <span style={{color:C.textSoft,fontWeight:"400"}}>vs last mo</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── FILTER BAR ───────────────────────────────────────────────────────────────
function FilterBar({ search, onSearch, activeStatus, onStatus }) {
  const sts = ["all","processing","shipped","delivered","cancelled","returns"];
  return (
    <div style={{background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:"12px",padding:"14px 18px",marginBottom:"16px",display:"flex",flexWrap:"wrap",gap:"12px",alignItems:"center",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
      <div style={{flex:"1 1 220px",position:"relative"}}>
        <span style={{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:C.textSoft,fontSize:"15px"}}>⌕</span>
        <input value={search} onChange={e=>onSearch(e.target.value)} placeholder="Search order ID, customer, product..."
          style={{width:"100%",background:C.surfaceAlt,border:`1.5px solid ${C.border}`,borderRadius:"9px",padding:"9px 14px 9px 36px",color:C.text,fontSize:"13px",outline:"none",fontFamily:"inherit",boxSizing:"border-box",transition:"border 0.15s"}}
          onFocus={e=>e.target.style.borderColor=C.primary}
          onBlur={e=>e.target.style.borderColor=C.border}
        />
      </div>
      <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
        {sts.map(s=>{
          const cfg = SC[s];
          const ac = s==="all" ? C.primary : cfg?.color;
          const isA = activeStatus===s;
          return (
            <button key={s} onClick={()=>onStatus(s)} style={{
              padding:"7px 14px",borderRadius:"20px",
              border:`1.5px solid ${isA?ac:C.border}`,
              background:isA?`${ac}15`:C.surface,
              color:isA?ac:C.textMid,
              fontSize:"12px",fontWeight:"700",cursor:"pointer",
              textTransform:"capitalize",fontFamily:"inherit",
              transition:"all 0.15s",
            }}
              onMouseEnter={e=>{if(!isA){e.currentTarget.style.borderColor=ac;e.currentTarget.style.color=ac;}}}
              onMouseLeave={e=>{if(!isA){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMid;}}}
            >{s==="all"?"All Orders":s}</button>
          );
        })}
      </div>
    </div>
  );
}

// ─── ORDER TABLE ──────────────────────────────────────────────────────────────
function OrderTable({ orders, onSelect, onStatusChange, selected, onSelectAll, onToggle }) {
  const [sf,setSf]=useState("date");
  const [sd,setSd]=useState("desc");
  const hs=f=>{setSd(d=>sf===f?(d==="asc"?"desc":"asc"):"desc");setSf(f);};
  const sorted=[...orders].sort((a,b)=>{
    let va=a[sf],vb=b[sf];
    if(sf==="total"){va=+va;vb=+vb;}
    if(sf==="date"){va=new Date(va);vb=new Date(vb);}
    return sd==="asc"?(va>vb?1:-1):(va<vb?1:-1);
  });

  const avatarColors = ["#ea580c","#0284c7","#16a34a","#7c3aed","#d97706","#dc2626","#0891b2","#059669"];

  return (
    <div style={{background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:"14px",overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:"880px"}}>
          <thead>
            <tr style={{background:"#fafaf9",borderBottom:`1.5px solid ${C.border}`}}>
              <th style={TH}>
                <input type="checkbox" checked={selected.length===orders.length&&orders.length>0} onChange={onSelectAll}
                  style={{accentColor:C.primary,width:"14px",height:"14px",cursor:"pointer"}}/>
              </th>
              {[["Order ID","id"],["Customer","customer"],["Product","product"],["Date","date"],["Total","total"],["Qty","items"],["Status","status"],["Actions",null]].map(([l,f])=>(
                <th key={l} onClick={()=>f&&hs(f)} style={{...TH,cursor:f?"pointer":"default",userSelect:"none"}}>
                  <span style={{display:"inline-flex",alignItems:"center",gap:"4px"}}>
                    {l}
                    {f&&<span style={{opacity:sf===f?1:0.3,fontSize:"9px",color:sf===f?C.primary:C.textSoft}}>{sf===f?(sd==="asc"?"▲":"▼"):"⇅"}</span>}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((o,i)=>{
              const cfg=SC[o.status]||SC.processing;
              const isSel=selected.includes(o.id);
              const av=avatarColors[i%avatarColors.length];
              return(
                <tr key={o.id} style={{borderBottom:`1px solid ${C.border}`,background:isSel?C.primaryLight:"transparent",transition:"background 0.12s",animation:`fuL 0.3s ease ${Math.min(i,14)*18}ms both`}}
                  onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background="#fafaf9";}}
                  onMouseLeave={e=>{if(!isSel)e.currentTarget.style.background="transparent";}}
                >
                  <td style={TD}>
                    <input type="checkbox" checked={isSel} onChange={()=>onToggle(o.id)}
                      style={{accentColor:C.primary,width:"14px",height:"14px",cursor:"pointer"}}/>
                  </td>
                  <td style={TD}>
                    <span style={{color:C.primary,fontFamily:"'DM Mono',monospace",fontSize:"12px",fontWeight:"700",background:C.primaryLight,padding:"3px 8px",borderRadius:"6px",border:`1px solid ${C.primaryMid}`}}>
                      {o.id}
                    </span>
                  </td>
                  <td style={TD}>
                    <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                      <div style={{width:"32px",height:"32px",borderRadius:"10px",background:av,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:"800",color:"#fff",flexShrink:0,letterSpacing:"-0.5px"}}>
                        {o.customer.split(" ").map(n=>n[0]).join("").slice(0,2)}
                      </div>
                      <div>
                        <div style={{color:C.text,fontSize:"13px",fontWeight:"600"}}>{o.customer}</div>
                        <div style={{color:C.textSoft,fontSize:"11px"}}>{o.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={TD}>
                    <div style={{color:C.text,fontSize:"13px",maxWidth:"160px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:"500"}}>{o.product}</div>
                    <div style={{color:C.textSoft,fontSize:"10px",fontFamily:"'DM Mono',monospace",marginTop:"1px"}}>{o.sku}</div>
                  </td>
                  <td style={TD}><span style={{color:C.textMid,fontSize:"12px"}}>{o.date}</span></td>
                  <td style={TD}>
                    <span style={{color:C.delivered.color,fontFamily:"'DM Mono',monospace",fontSize:"14px",fontWeight:"800"}}>${o.total.toFixed(2)}</span>
                  </td>
                  <td style={TD}><span style={{color:C.textMid,fontSize:"13px",fontWeight:"600"}}>{o.items}</span></td>
                  <td style={TD}>
                    <span style={{display:"inline-flex",alignItems:"center",gap:"5px",background:cfg.bg,color:cfg.color,border:`1.5px solid ${cfg.border}`,borderRadius:"20px",padding:"4px 11px",fontSize:"10px",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                      <span style={{fontSize:"11px"}}>{cfg.icon}</span> {cfg.label}
                    </span>
                  </td>
                  <td style={TD}>
                    <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
                      <button onClick={()=>onSelect(o)} title="View Details" style={{
                        background:C.primaryLight,border:`1.5px solid ${C.primaryMid}`,
                        borderRadius:"8px",padding:"6px 10px",color:C.primary,
                        fontSize:"13px",cursor:"pointer",lineHeight:1,transition:"all 0.15s",fontWeight:"600",
                      }}
                        onMouseEnter={e=>{e.currentTarget.style.background=C.primary;e.currentTarget.style.color="#fff";}}
                        onMouseLeave={e=>{e.currentTarget.style.background=C.primaryLight;e.currentTarget.style.color=C.primary;}}
                      >View</button>
                      <select value={o.status} onChange={e=>onStatusChange(o.id,e.target.value)} style={{
                        background:C.surfaceAlt,border:`1.5px solid ${C.border}`,
                        borderRadius:"8px",color:C.textMid,fontSize:"11px",
                        padding:"5px 7px",cursor:"pointer",outline:"none",fontFamily:"inherit",
                        transition:"border 0.15s",
                      }}
                        onFocus={e=>e.target.style.borderColor=C.primary}
                        onBlur={e=>e.target.style.borderColor=C.border}
                      >
                        {Object.entries(SC).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {orders.length===0&&(
        <div style={{textAlign:"center",padding:"60px 20px",color:C.textSoft}}>
          <div style={{fontSize:"42px",marginBottom:"12px"}}>📭</div>
          <div style={{fontSize:"16px",fontWeight:"700",color:C.textMid}}>No orders found</div>
          <div style={{fontSize:"13px",marginTop:"6px"}}>Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  );
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────
function DetailModal({ order, onClose, onStatus }) {
  if(!order)return null;
  const cfg=SC[order.status]||SC.processing;
  const TL={
    processing:[{l:"Order Placed",d:true,dt:"Feb 10"},{l:"Payment",d:true,dt:"Feb 10"},{l:"Processing",d:true,dt:"Feb 11"},{l:"Shipped",d:false,dt:"—"},{l:"Delivered",d:false,dt:"—"}],
    shipped:   [{l:"Order Placed",d:true,dt:"Feb 10"},{l:"Payment",d:true,dt:"Feb 10"},{l:"Processing",d:true,dt:"Feb 11"},{l:"Shipped",d:true,dt:"Feb 13"},{l:"Delivered",d:false,dt:"Expected"}],
    delivered: [{l:"Order Placed",d:true,dt:"Feb 10"},{l:"Payment",d:true,dt:"Feb 10"},{l:"Processing",d:true,dt:"Feb 11"},{l:"Shipped",d:true,dt:"Feb 13"},{l:"Delivered",d:true,dt:"Feb 15"}],
    cancelled: [{l:"Order Placed",d:true,dt:"Feb 10"},{l:"Cancelled",d:true,dt:"Feb 11"},{l:"Refund Init.",d:true,dt:"Feb 12"},{l:"Refunded",d:false,dt:"—"}],
    returns:   [{l:"Delivered",d:true,dt:"Feb 10"},{l:"Return Req.",d:true,dt:"Feb 13"},{l:"Approved",d:true,dt:"Feb 14"},{l:"Item Rcvd",d:false,dt:"—"},{l:"Refunded",d:false,dt:"—"}],
  };
  const steps=TL[order.status]||TL.delivered;

  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(28,25,23,0.5)",backdropFilter:"blur(4px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",animation:"fiL 0.2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:"20px",width:"100%",maxWidth:"700px",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.15)",animation:"suL 0.3s cubic-bezier(0.34,1.56,0.64,1)"}}>
        {/* Top accent bar */}
        <div style={{height:"4px",background:`linear-gradient(90deg, ${C.primary}, ${C.primaryBorder})`,borderRadius:"20px 20px 0 0"}}/>

        {/* Header */}
        <div style={{padding:"22px 26px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:C.surface,zIndex:10}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
              <span style={{color:C.primary,fontFamily:"'DM Mono',monospace",fontSize:"17px",fontWeight:"800",background:C.primaryLight,padding:"4px 12px",borderRadius:"8px",border:`1px solid ${C.primaryMid}`}}>{order.id}</span>
              <span style={{background:cfg.bg,color:cfg.color,border:`1.5px solid ${cfg.border}`,borderRadius:"20px",padding:"4px 13px",fontSize:"11px",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                {cfg.icon} {cfg.label}
              </span>
            </div>
            <div style={{color:C.textSoft,fontSize:"12px",marginTop:"5px"}}>Placed on {order.date}</div>
          </div>
          <button onClick={onClose} style={{background:C.surfaceAlt,border:`1.5px solid ${C.border}`,borderRadius:"10px",width:"34px",height:"34px",color:C.textMid,cursor:"pointer",fontSize:"20px",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}
            onMouseEnter={e=>{e.currentTarget.style.background=C.primaryLight;e.currentTarget.style.borderColor=C.primary;e.currentTarget.style.color=C.primary;}}
            onMouseLeave={e=>{e.currentTarget.style.background=C.surfaceAlt;e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMid;}}
          >×</button>
        </div>

        <div style={{padding:"22px 26px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
          {/* Customer */}
          <div style={SEC}>
            <div style={SECT}>👤 Customer Info</div>
            <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px",padding:"12px",background:C.primaryLight,borderRadius:"10px",border:`1px solid ${C.primaryMid}`}}>
              <div style={{width:"42px",height:"42px",borderRadius:"12px",background:C.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",fontWeight:"800",color:"#fff",flexShrink:0}}>
                {order.customer.split(" ").map(n=>n[0]).join("").slice(0,2)}
              </div>
              <div>
                <div style={{color:C.text,fontWeight:"700",fontSize:"14px"}}>{order.customer}</div>
                <div style={{color:C.textMid,fontSize:"12px"}}>{order.email}</div>
              </div>
            </div>
            <DR l="Phone" v={order.phone}/>
            <DR l="Country" v={order.country}/>
          </div>

          {/* Shipping */}
          <div style={SEC}>
            <div style={SECT}>📍 Shipping Address</div>
            <DR l="Address" v={order.address}/>
            <DR l="City" v={order.city}/>
            <DR l="ZIP" v={order.zip}/>
            <DR l="Tracking" v={order.tracking||"N/A"} hi={!!order.tracking}/>
            {order.notes&&<div style={{marginTop:"10px",padding:"8px 10px",background:"#fffbeb",border:"1px solid #fde68a",borderRadius:"8px",fontSize:"11px",color:C.processing.color}}>💬 {order.notes}</div>}
          </div>

          {/* Items */}
          <div style={{...SEC,gridColumn:"1/-1"}}>
            <div style={SECT}>🛒 Order Items</div>
            <div style={{border:`1.5px solid ${C.border}`,borderRadius:"10px",overflow:"hidden",marginBottom:"14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",background:C.surfaceAlt}}>
                <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                  <div style={{width:"38px",height:"38px",borderRadius:"9px",background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",border:`1.5px solid ${C.primaryMid}`}}>📦</div>
                  <div>
                    <div style={{color:C.text,fontSize:"13px",fontWeight:"600"}}>{order.product}</div>
                    <div style={{color:C.textSoft,fontSize:"10px",fontFamily:"'DM Mono',monospace"}}>{order.sku}</div>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{color:C.delivered.color,fontFamily:"'DM Mono',monospace",fontWeight:"800",fontSize:"15px"}}>${order.total.toFixed(2)}</div>
                  <div style={{color:C.textSoft,fontSize:"10px",marginTop:"1px"}}>Qty: {order.items}</div>
                </div>
              </div>
            </div>
            {[["Subtotal",`$${(order.total*0.88).toFixed(2)}`],["Shipping","$8.99"],["Tax",`$${Math.max(0,order.total*0.12-8.99).toFixed(2)}`]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 2px",borderBottom:`1px solid ${C.border}`}}>
                <span style={{color:C.textMid,fontSize:"13px"}}>{l}</span>
                <span style={{color:C.text,fontSize:"13px",fontFamily:"'DM Mono',monospace"}}>{v}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0 2px",borderTop:`2px solid ${C.border}`,marginTop:"8px"}}>
              <span style={{color:C.text,fontSize:"15px",fontWeight:"800"}}>Total</span>
              <span style={{color:C.primary,fontSize:"18px",fontWeight:"900",fontFamily:"'DM Mono',monospace"}}>${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Timeline */}
          <div style={{...SEC,gridColumn:"1/-1"}}>
            <div style={SECT}>📋 Order Timeline</div>
            <div style={{display:"flex",overflowX:"auto",paddingBottom:"4px"}}>
              {steps.map((s,i)=>(
                <div key={s.l} style={{flex:1,minWidth:"90px",textAlign:"center",position:"relative"}}>
                  {i<steps.length-1&&<div style={{position:"absolute",top:"13px",left:"50%",width:"100%",height:"2px",background:s.d&&steps[i+1]?.d?C.primary:C.border}}/>}
                  <div style={{width:"26px",height:"26px",borderRadius:"50%",background:s.d?C.primary:C.surface,border:`2px solid ${s.d?C.primary:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px",position:"relative",zIndex:1,fontSize:"11px",color:"#fff",fontWeight:"800",boxShadow:s.d?`0 2px 8px ${C.primary}40`:"none"}}>
                    {s.d?"✓":""}
                  </div>
                  <div style={{color:s.d?C.text:C.textSoft,fontSize:"10px",fontWeight:"600"}}>{s.l}</div>
                  <div style={{color:C.textSoft,fontSize:"9px",marginTop:"2px"}}>{s.dt}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{padding:"18px 26px",borderTop:`1px solid ${C.border}`,display:"flex",gap:"8px",flexWrap:"wrap",justifyContent:"flex-end",background:C.surfaceAlt,borderRadius:"0 0 20px 20px"}}>
          <button onClick={onClose} style={OBtn("ghost")}>Close</button>
          {order.status==="processing"&&<button onClick={()=>{onStatus(order.id,"shipped");onClose();}} style={OBtn("blue")}>🚚 Mark Shipped</button>}
          {order.status==="shipped"&&<button onClick={()=>{onStatus(order.id,"delivered");onClose();}} style={OBtn("green")}>✅ Mark Delivered</button>}
          {(order.status==="processing"||order.status==="shipped")&&<button onClick={()=>{onStatus(order.id,"cancelled");onClose();}} style={OBtn("red")}>✕ Cancel Order</button>}
          {order.status==="delivered"&&<button onClick={()=>{onStatus(order.id,"returns");onClose();}} style={OBtn("purple")}>↩ Process Return</button>}
        </div>
      </div>
    </div>
  );
}

// ─── EXPORT MODAL ─────────────────────────────────────────────────────────────
function ExportModal({ onClose }) {
  const [fmt,setFmt]=useState("csv");
  const [status,setStatus]=useState("all");
  const [exporting,setExporting]=useState(false);
  const [done,setDone]=useState(false);
  const [fields,setFields]=useState(["Order ID","Customer","Email","Product","Total","Status","Date"]);
  const ALL_F=["Order ID","Customer","Email","Phone","Product","SKU","Date","Total","Items","Status","Address","Tracking"];
  const FMTS=[{id:"csv",icon:"📄",label:"CSV",desc:"Spreadsheet"},{id:"excel",icon:"📊",label:"Excel",desc:"XLSX format"},{id:"pdf",icon:"📋",label:"PDF",desc:"Printable"},{id:"json",icon:"🔧",label:"JSON",desc:"Developer"}];
  const STS=["all","processing","shipped","delivered","cancelled","returns"];
  const tog=f=>setFields(p=>p.includes(f)?p.filter(x=>x!==f):[...p,f]);
  const run=async()=>{
    setExporting(true);
    await new Promise(r=>setTimeout(r,1600));
    const blob=new Blob([JSON.stringify({format:fmt,status,fields,exported:new Date().toISOString()},null,2)],{type:"application/json"});
    const u=URL.createObjectURL(blob);const a=document.createElement("a");a.href=u;a.download=`orders_${status}_${new Date().toISOString().split("T")[0]}.json`;a.click();URL.revokeObjectURL(u);
    setExporting(false);setDone(true);setTimeout(()=>{setDone(false);onClose();},2000);
  };

  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(28,25,23,0.5)",backdropFilter:"blur(4px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",animation:"fiL 0.2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:"20px",width:"100%",maxWidth:"560px",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.15)",animation:"suL 0.3s cubic-bezier(0.34,1.56,0.64,1)"}}>
        <div style={{height:"4px",background:`linear-gradient(90deg,${C.primary},${C.primaryBorder})`,borderRadius:"20px 20px 0 0"}}/>
        <div style={{padding:"22px 26px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{color:C.text,fontSize:"17px",fontWeight:"800"}}>Export Orders</div>
            <div style={{color:C.textSoft,fontSize:"12px",marginTop:"2px"}}>Download order data in your preferred format</div>
          </div>
          <button onClick={onClose} style={{background:C.surfaceAlt,border:`1.5px solid ${C.border}`,borderRadius:"10px",width:"34px",height:"34px",color:C.textMid,cursor:"pointer",fontSize:"20px",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>

        <div style={{padding:"22px 26px",display:"flex",flexDirection:"column",gap:"20px"}}>
          {/* Format */}
          <div>
            <div style={SECT}>Export Format</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
              {FMTS.map(f=>(
                <button key={f.id} onClick={()=>setFmt(f.id)} style={{
                  background:fmt===f.id?C.primaryLight:C.surfaceAlt,
                  border:`2px solid ${fmt===f.id?C.primary:C.border}`,
                  borderRadius:"11px",padding:"14px",cursor:"pointer",
                  textAlign:"left",fontFamily:"inherit",transition:"all 0.2s",
                  boxShadow:fmt===f.id?`0 2px 10px ${C.primary}20`:"none",
                }}>
                  <div style={{fontSize:"20px",marginBottom:"5px"}}>{f.icon}</div>
                  <div style={{color:fmt===f.id?C.primary:C.text,fontWeight:"700",fontSize:"13px"}}>{f.label}</div>
                  <div style={{color:C.textSoft,fontSize:"11px",marginTop:"2px"}}>{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <div style={SECT}>Filter by Status</div>
            <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
              {STS.map(s=>{
                const ac=s==="all"?C.primary:SC[s]?.color;
                const isA=status===s;
                return(<button key={s} onClick={()=>setStatus(s)} style={{padding:"6px 13px",borderRadius:"20px",border:`1.5px solid ${isA?ac:C.border}`,background:isA?`${ac}15`:C.surface,color:isA?ac:C.textMid,fontSize:"11px",fontWeight:"700",cursor:"pointer",textTransform:"capitalize",fontFamily:"inherit"}}>{s==="all"?"All":s}</button>);
              })}
            </div>
          </div>

          {/* Fields */}
          <div>
            <div style={SECT}>Include Fields ({fields.length}/{ALL_F.length})</div>
            <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
              {ALL_F.map(f=>(
                <button key={f} onClick={()=>tog(f)} style={{padding:"5px 11px",borderRadius:"8px",border:`1.5px solid ${fields.includes(f)?C.primary:C.border}`,background:fields.includes(f)?C.primaryLight:C.surface,color:fields.includes(f)?C.primary:C.textMid,fontSize:"11px",fontWeight:"600",cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>
                  {fields.includes(f)?"✓ ":""}{f}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div style={{background:C.surfaceAlt,borderRadius:"12px",padding:"16px",border:`1.5px solid ${C.border}`}}>
            <div style={{...SECT,marginBottom:"12px"}}>Export Preview</div>
            <div style={{display:"flex",justifyContent:"space-around"}}>
              {[["Records","~847"],["Fields",fields.length],["Format",fmt.toUpperCase()],["Status",status==="all"?"All":status]].map(([l,v])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{color:C.primary,fontFamily:"'DM Mono',monospace",fontSize:"20px",fontWeight:"800"}}>{v}</div>
                  <div style={{color:C.textSoft,fontSize:"10px",marginTop:"3px",fontWeight:"600",textTransform:"uppercase",letterSpacing:"0.04em"}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{padding:"18px 26px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"flex-end",gap:"8px",background:C.surfaceAlt,borderRadius:"0 0 20px 20px"}}>
          <button onClick={onClose} style={OBtn("ghost")}>Cancel</button>
          <button onClick={run} disabled={exporting||fields.length===0} style={{...OBtn("primary"),opacity:fields.length===0?0.5:1,cursor:exporting?"wait":"pointer",display:"flex",alignItems:"center",gap:"6px"}}>
            {exporting?<><span style={{animation:"spinL 1s linear infinite",display:"inline-block"}}>⟳</span>Exporting...</>:done?"✓ Done!":"Export Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── BULK BAR ─────────────────────────────────────────────────────────────────
function BulkBar({ count, onBulkStatus, onClear }) {
  if(!count)return null;
  const acts=[
    {l:"⚙️ Processing",s:"processing",c:C.processing.color,bg:C.processing.bg,bd:C.processing.border},
    {l:"🚚 Shipped",   s:"shipped",   c:C.shipped.color,   bg:C.shipped.bg,   bd:C.shipped.border},
    {l:"✅ Delivered", s:"delivered", c:C.delivered.color, bg:C.delivered.bg, bd:C.delivered.border},
    {l:"✕ Cancel",    s:"cancelled", c:C.cancelled.color, bg:C.cancelled.bg, bd:C.cancelled.border},
    {l:"↩ Return",    s:"returns",   c:C.returns.color,   bg:C.returns.bg,   bd:C.returns.border},
  ];
  return(
    <div style={{position:"fixed",bottom:"22px",left:"50%",transform:"translateX(-50%)",background:C.surface,border:`2px solid ${C.primary}`,borderRadius:"16px",padding:"12px 18px",display:"flex",alignItems:"center",gap:"10px",boxShadow:`0 8px 32px ${C.primary}30`,zIndex:500,animation:"bulkInL 0.3s cubic-bezier(0.34,1.56,0.64,1)",flexWrap:"wrap"}}>
      <div style={{display:"flex",alignItems:"center",gap:"7px"}}>
        <div style={{background:C.primary,color:"#fff",borderRadius:"50%",width:"26px",height:"26px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:"800"}}>{count}</div>
        <span style={{color:C.text,fontSize:"12px",fontWeight:"700"}}>selected</span>
      </div>
      <div style={{width:"1px",height:"22px",background:C.border}}/>
      <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
        {acts.map(a=>(
          <button key={a.s} onClick={()=>onBulkStatus(a.s)} style={{background:a.bg,border:`1.5px solid ${a.bd}`,borderRadius:"9px",padding:"6px 11px",color:a.c,fontSize:"11px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}
            onMouseEnter={e=>{e.currentTarget.style.background=a.c;e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background=a.bg;e.currentTarget.style.color=a.c;}}
          >{a.l}</button>
        ))}
      </div>
      <div style={{width:"1px",height:"22px",background:C.border}}/>
      <button onClick={onClear} style={{background:C.surfaceAlt,border:`1.5px solid ${C.border}`,borderRadius:"8px",padding:"6px 12px",color:C.textMid,fontSize:"11px",cursor:"pointer",fontFamily:"inherit"}}>Clear</button>
    </div>
  );
}

// ─── PAGINATION ───────────────────────────────────────────────────────────────
function Pager({ cur, total, onPage, totalItems, pp }) {
  const s=Math.max(1,cur-2), e=Math.min(total,cur+2);
  const pages=Array.from({length:e-s+1},(_,i)=>s+i);
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:"12px",marginTop:"12px",flexWrap:"wrap",gap:"8px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
      <div style={{color:C.textMid,fontSize:"12px"}}>
        Showing <b style={{color:C.text}}>{Math.min((cur-1)*pp+1,totalItems)}–{Math.min(cur*pp,totalItems)}</b> of <b style={{color:C.text}}>{totalItems}</b> orders
      </div>
      <div style={{display:"flex",gap:"4px",alignItems:"center"}}>
        <PG onClick={()=>onPage(cur-1)} dis={cur===1}>‹ Prev</PG>
        {s>1&&<><PG onClick={()=>onPage(1)}>1</PG>{s>2&&<span style={{color:C.textSoft,padding:"0 2px"}}>…</span>}</>}
        {pages.map(p=><PG key={p} onClick={()=>onPage(p)} act={p===cur}>{p}</PG>)}
        {e<total&&<>{e<total-1&&<span style={{color:C.textSoft,padding:"0 2px"}}>…</span>}<PG onClick={()=>onPage(total)}>{total}</PG></>}
        <PG onClick={()=>onPage(cur+1)} dis={cur===total}>Next ›</PG>
      </div>
    </div>
  );
}
function PG({children,onClick,act,dis}){
  return<button onClick={onClick} disabled={dis} style={{padding:"6px 12px",borderRadius:"8px",border:`1.5px solid ${act?C.primary:C.border}`,background:act?C.primary:C.surface,color:act?"#fff":dis?C.textXsoft:C.textMid,fontSize:"12px",fontWeight:act?"700":"500",cursor:dis?"not-allowed":"pointer",fontFamily:"inherit",minWidth:"32px",transition:"all 0.15s"}}
    onMouseEnter={e=>{if(!dis&&!act){e.currentTarget.style.borderColor=C.primary;e.currentTarget.style.color=C.primary;}}}
    onMouseLeave={e=>{if(!dis&&!act){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMid;}}}
  >{children}</button>;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function DR({l,v,hi}){
  return<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
    <span style={{color:C.textSoft,fontSize:"12px",fontWeight:"500"}}>{l}</span>
    <span style={{color:hi?C.primary:C.text,fontSize:"12px",fontWeight:"600",fontFamily:hi?"'DM Mono',monospace":"inherit"}}>{v||"—"}</span>
  </div>;
}

// Button variants
function OBtn(variant){
  const variants={
    primary:{background:C.primary,border:`2px solid ${C.primary}`,color:"#fff"},
    ghost:{background:"transparent",border:`2px solid ${C.border}`,color:C.textMid},
    blue:{background:C.shipped.color,border:`2px solid ${C.shipped.color}`,color:"#fff"},
    green:{background:C.delivered.color,border:`2px solid ${C.delivered.color}`,color:"#fff"},
    red:{background:C.cancelled.color,border:`2px solid ${C.cancelled.color}`,color:"#fff"},
    purple:{background:C.returns.color,border:`2px solid ${C.returns.color}`,color:"#fff"},
  };
  return{...variants[variant],borderRadius:"10px",padding:"9px 20px",fontSize:"13px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"};
}

const TH={padding:"12px 16px",textAlign:"left",color:C.textMid,fontSize:"11px",fontWeight:"700",letterSpacing:"0.07em",textTransform:"uppercase"};
const TD={padding:"13px 16px",verticalAlign:"middle"};
const SEC={background:C.surfaceAlt,borderRadius:"12px",padding:"16px",border:`1.5px solid ${C.border}`};
const SECT={color:C.textSoft,fontSize:"10px",fontWeight:"700",letterSpacing:"0.09em",textTransform:"uppercase",marginBottom:"12px"};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const PP=12;
export default function App() {
  const [orders,setOrders]=useState(()=>genOrders(150));
  const [search,setSearch]=useState("");
  const [sf,setSf]=useState("all");
  const [page,setPage]=useState(1);
  const [sel,setSel]=useState([]);
  const [activeO,setActiveO]=useState(null);
  const [showExp,setShowExp]=useState(false);
  const [notif,setNotif]=useState(null);
  const [sideOpen,setSideOpen]=useState(true);

  const showN=(msg,c=C.primary)=>{setNotif({msg,c});setTimeout(()=>setNotif(null),2800);};

  const filtered=useMemo(()=>orders.filter(o=>{
    const ms=sf==="all"||o.status===sf;
    const q=search.toLowerCase();
    const mq=!q||o.id.toLowerCase().includes(q)||o.customer.toLowerCase().includes(q)||o.product.toLowerCase().includes(q)||o.email.toLowerCase().includes(q);
    return ms&&mq;
  }),[orders,search,sf]);

  const totalPg=Math.max(1,Math.ceil(filtered.length/PP));
  const paged=filtered.slice((page-1)*PP,page*PP);

  const onStatusChange=(id,ns)=>{setOrders(p=>p.map(o=>o.id===id?{...o,status:ns}:o));showN(`${id} updated to ${ns}`);if(activeO?.id===id)setActiveO(p=>({...p,status:ns}));};
  const onBulk=(ns)=>{setOrders(p=>p.map(o=>sel.includes(o.id)?{...o,status:ns}:o));showN(`${sel.length} orders updated to ${ns}`);setSel([]);};
  const tog=id=>setSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const selAll=()=>setSel(p=>p.length===paged.length?[]:paged.map(o=>o.id));
  const onF=s=>{setSf(s);setPage(1);setSel([]);};
  const onS=v=>{setSearch(v);setPage(1);setSel([]);};

  // Nav items
  const navItems=[["📊","Dashboard"],["📦","Orders"],["👥","Customers"],["🛍️","Products"],["📈","Analytics"],["⚙️","Settings"]];

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Plus Jakarta Sans','Nunito',sans-serif",display:"flex"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:${C.surfaceAlt};}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:4px;}
        @keyframes fuL{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}
        @keyframes fiL{from{opacity:0;}to{opacity:1;}}
        @keyframes suL{from{opacity:0;transform:translateY(24px) scale(0.97);}to{opacity:1;transform:none;}}
        @keyframes spinL{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes notInL{from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:none;}}
        @keyframes bulkInL{from{opacity:0;transform:translateX(-50%) translateY(16px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
        select option{background:${C.surface};color:${C.text};}
      `}</style>

      {/* Sidebar */}
      

      {/* Main Content */}
      <div style={{flex:1,padding:"24px 28px",minWidth:0,overflowX:"hidden"}}>
        {/* Top header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"24px",flexWrap:"wrap",gap:"14px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            
            <div>
              
              <h1 style={{margin:0,fontSize:"24px",fontWeight:"900",color:C.text,letterSpacing:"-0.5px"}}>Order Management</h1>
              <p style={{margin:"4px 0 0",color:C.textSoft,fontSize:"13px"}}>
                {filtered.length.toLocaleString()} orders
                {sel.length>0&&<span style={{color:C.primary,fontWeight:"700"}}> · {sel.length} selected</span>}
                <span style={{marginLeft:"6px"}}>· Updated just now</span>
              </p>
            </div>
          </div>

          <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
            {/* Search icon shortcut */}
            <div style={{background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:"9px",padding:"9px 12px",color:C.textSoft,fontSize:"12px",cursor:"default",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
              📅 Feb 17, 2026
            </div>
            <button onClick={()=>setShowExp(true)} style={{background:C.surface,border:`2px solid ${C.border}`,borderRadius:"10px",padding:"9px 18px",color:C.text,fontSize:"13px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:"6px",boxShadow:"0 1px 3px rgba(0,0,0,0.05)",transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.primary;e.currentTarget.style.color=C.primary;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.text;}}
            >
              ↑ Export
            </button>
            
          </div>
        </div>

        {/* Stats */}
        <OrderStats orders={orders} onFilter={onF} activeFilter={sf}/>

        {/* Filters */}
        <FilterBar search={search} onSearch={onS} activeStatus={sf} onStatus={onF}/>

        {/* Selection notice */}
        {sel.length>0&&(
          <div style={{background:C.primaryLight,border:`1.5px solid ${C.primaryMid}`,borderRadius:"10px",padding:"10px 16px",display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px",fontSize:"12px",animation:"fuL 0.2s ease"}}>
            <span style={{fontSize:"16px"}}>☑️</span>
            <span style={{color:C.primary,fontWeight:"700"}}>{sel.length} orders selected</span>
            <span style={{color:C.textMid}}>— use the bulk action bar below or</span>
            <button onClick={()=>setSel([])} style={{background:"transparent",border:"none",color:C.primary,cursor:"pointer",fontSize:"12px",fontFamily:"inherit",textDecoration:"underline",fontWeight:"600"}}>clear selection</button>
          </div>
        )}

        {/* Table */}
        <OrderTable orders={paged} onSelect={setActiveO} onStatusChange={onStatusChange} selected={sel} onSelectAll={selAll} onToggle={tog}/>

        {/* Pagination */}
        {totalPg>1&&<Pager cur={page} total={totalPg} onPage={p=>{setPage(p);setSel([]);}} totalItems={filtered.length} pp={PP}/>}

        {/* Footer */}
        <div style={{marginTop:"24px",textAlign:"center",color:C.textSoft,fontSize:"11px"}}>
          OrderHub Admin · {new Date().getFullYear()} · <span style={{color:C.primary,fontWeight:"600"}}>v2.1.0</span>
        </div>
      </div>

      {/* Modals */}
      {activeO&&<DetailModal order={activeO} onClose={()=>setActiveO(null)} onStatus={onStatusChange}/>}
      {showExp&&<ExportModal onClose={()=>setShowExp(false)}/>}

      {/* Bulk bar */}
      <BulkBar count={sel.length} onBulkStatus={onBulk} onClear={()=>setSel([])}/>

      {/* Toast notification */}
      {notif&&(
        <div style={{position:"fixed",top:"20px",right:"20px",zIndex:9999,background:notif.c,color:"#fff",borderRadius:"12px",padding:"12px 20px",fontSize:"13px",fontWeight:"700",boxShadow:`0 8px 24px ${notif.c}40`,animation:"notInL 0.3s ease",display:"flex",alignItems:"center",gap:"8px"}}>
          <span style={{fontSize:"16px"}}>✓</span> {notif.msg}
        </div>
      )}
    </div>
  );
}