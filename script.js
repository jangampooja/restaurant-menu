// MenuPro: frontend-only menu manager. Data is persisted in browser localStorage.
const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "menupro_data_v1";
const TAGS = ["Vegetarian","Non-Vegetarian","Vegan","Gluten-Free","Dairy-Free","Spicy","Chef's Special"];
const seed = {
  categories:[
    {id:1,name:"Appetizers",description:"Small plates to start your meal",icon:"🥗"},
    {id:2,name:"Soups & Salads",description:"Fresh, comforting bowls",icon:"🍲"},
    {id:3,name:"Main Course",description:"Our signature main dishes",icon:"🍝"},
    {id:4,name:"Pizzas",description:"Oven-baked favourites",icon:"🍕"},
    {id:5,name:"Burgers",description:"Stacked and satisfying",icon:"🍔"},
    {id:6,name:"Desserts",description:"A sweet ending",icon:"🍰"},
    {id:7,name:"Beverages",description:"Refreshing sips",icon:"🍹"},
    {id:8,name:"Specials",description:"Chef's seasonal picks",icon:"⭐"}
  ],
  items:[
    {id:101,name:"Creamy Garlic Pasta",description:"Silky parmesan sauce, roasted garlic and fresh herbs.",category_id:3,price:289,tags:["Vegetarian"],image:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=700",status:"Available",ingredients:["Pasta","Cream","Garlic"],allergens:["Gluten","Dairy"],orders:86,views:240,special_price:null},
    {id:102,name:"Margherita Pizza",description:"Classic tomato, mozzarella and fragrant basil.",category_id:4,price:249,tags:["Vegetarian"],image:"https://images.unsplash.com/photo-1579751626657-72bc17010498?w=700",status:"Available",ingredients:["Dough","Tomato","Cheese"],allergens:["Gluten","Dairy"],orders:74,views:210,special_price:null},
    {id:103,name:"Crispy Veg Burger",description:"Golden vegetable patty, lettuce and house sauce.",category_id:5,price:179,tags:["Vegetarian"],image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700",status:"Available",ingredients:["Bun","Potato","Lettuce"],allergens:["Gluten"],orders:63,views:190,special_price:null},
    {id:104,name:"Grilled Chicken Bowl",description:"Herb grilled chicken with rice and seasonal vegetables.",category_id:3,price:329,tags:["Non-Vegetarian","Gluten-Free"],image:"https://images.unsplash.com/photo-1547592180-85f173990554?w=700",status:"Limited Stock",ingredients:["Chicken","Rice","Vegetables"],allergens:[],orders:58,views:165,special_price:null},
    {id:105,name:"Chocolate Lava Cake",description:"Warm chocolate cake with a rich molten centre.",category_id:6,price:159,tags:["Vegetarian","Chef's Special"],image:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=700",status:"Available",ingredients:["Chocolate","Flour","Eggs"],allergens:["Gluten","Dairy","Eggs"],orders:52,views:180,special_price:null},
    {id:106,name:"Fresh Lime Cooler",description:"Fresh lime, mint and sparkling soda.",category_id:7,price:99,tags:["Vegan","Dairy-Free"],image:"https://images.unsplash.com/photo-1513558161293-cafb7c6cadab?w=700",status:"Available",ingredients:["Lime","Mint","Soda"],allergens:[],orders:45,views:150,special_price:null},
    {id:107,name:"Tomato Basil Soup",description:"Slow simmered tomato soup with basil oil.",category_id:2,price:129,tags:["Vegan","Gluten-Free"],image:"https://images.unsplash.com/photo-1547592166-23ac45744acd?w=700",status:"Available",ingredients:["Tomato","Basil"],allergens:[],orders:31,views:120,special_price:null},
    {id:108,name:"Paneer Tikka",description:"Chargrilled paneer cubes with peppers and spices.",category_id:1,price:219,tags:["Vegetarian","Spicy"],image:"https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=700",status:"New Item",ingredients:["Paneer","Pepper","Yogurt"],allergens:["Dairy"],orders:22,views:98,special_price:null}
  ],
  inventory:[
    {id:201,name:"Mozzarella cheese",usedIn:"Pizza, Pasta",qty:2.4,unit:"kg",reorder:3},
    {id:202,name:"Fresh tomatoes",usedIn:"Pizza, Soup, Sauce",qty:8,unit:"kg",reorder:4},
    {id:203,name:"Pasta",usedIn:"Creamy Garlic Pasta",qty:1.2,unit:"kg",reorder:2},
    {id:204,name:"Chicken breast",usedIn:"Grilled Chicken Bowl",qty:5,unit:"kg",reorder:2},
    {id:205,name:"Fresh mint",usedIn:"Fresh Lime Cooler",qty:0.3,unit:"kg",reorder:0.5}
  ],
  versions:[], user:null, language:"en", dark:false
};
let data = loadData();
let digitalFilter = "all";

function loadData(){try{return {...structuredClone(seed),...JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}")};}catch{return structuredClone(seed);}}
function saveData(message="Changes saved"){localStorage.setItem(STORAGE_KEY,JSON.stringify(data)); renderAll(); toast(message);}
function snapshot(note="Menu updated"){data.versions.unshift({id:Date.now(),version:`v1.${data.versions.length+1}`,note,date:new Date().toLocaleString(),items:structuredClone(data.items),categories:structuredClone(data.categories)});data.versions=data.versions.slice(0,30);localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}
function toast(message){const t=$("toast");t.textContent=message;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2400);}
function money(n){return "₹"+Number(n||0).toFixed(2).replace(/\.00$/,"");}
function catName(id){return data.categories.find(c=>c.id===id)?.name||"Uncategorized";}
function safe(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function img(src,name){return src?`<img class="food-thumb" src="${safe(src)}" alt="${safe(name)}" onerror="this.outerHTML='<span class=\\'food-thumb\\'>🍽️</span>'">`:`<span class="food-thumb">🍽️</span>`;}
function statusClass(s){return s.toLowerCase().replaceAll(" ","-");}
function showPage(page){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===page));document.querySelectorAll(".nav-link").forEach(a=>a.classList.toggle("active",a.dataset.page===page));$("pageTitle").textContent=({dashboard:"Dashboard",categories:"Categories",items:"Menu items","digital-menu":"Digital menu",pricing:"Pricing & offers",inventory:"Inventory",analytics:"Menu analytics",reports:"Reports",versions:"Version history"})[page]||"Dashboard";$("sidebar").classList.remove("open");location.hash=page;renderAll();}
function renderAll(){renderDashboard();renderCategories();renderItems();renderDigital();renderPricing();renderInventory();renderAnalytics();renderReports();renderVersions();populateSelects();}
function renderDashboard(){
 const available=data.items.filter(i=>i.status==="Available").length, low=data.inventory.filter(i=>i.qty<=i.reorder).length;
 $("dashboardStats").innerHTML=[["Menu items",data.items.length,"Across all categories","☷"],["Categories",data.categories.length,"Organized menu sections","▤"],["Available today",available,"Ready to be ordered","✓"],["Low stock alerts",low,"Ingredients to restock","!"]].map(([l,v,n,ic])=>`<div class="stat-card"><div class="stat-top">${l}<span class="stat-icon">${ic}</span></div><div class="stat-value">${v}</div><div class="stat-note">${n}</div></div>`).join("");
 $("popularItems").innerHTML=[...data.items].sort((a,b)=>b.orders-a.orders).slice(0,4).map(i=>`<div class="popular-row">${img(i.image,i.name)}<div class="grow"><strong>${safe(i.name)}</strong><small>${catName(i.category_id)}</small></div><span class="row-end">${i.orders} orders</span></div>`).join("")||empty("No menu items yet");
 $("dashboardAlerts").innerHTML=data.inventory.filter(i=>i.qty<=i.reorder).map(i=>`<div class="alert-row"><span class="stat-icon">!</span><div class="grow"><strong>${safe(i.name)}</strong><small>${i.qty} ${safe(i.unit)} remaining · reorder at ${i.reorder}</small></div><span class="status limited-stock">Low stock</span></div>`).join("")||`<div class="empty-state">All ingredients are well stocked ✨</div>`;
}
function empty(t){return `<div class="empty-state">${t}</div>`;}
function renderCategories(){$("categoryGrid").innerHTML=data.categories.map(c=>`<article class="category-card"><div class="category-icon">${safe(c.icon)}</div><h3>${safe(c.name)}</h3><p>${safe(c.description||"No description")}</p><div class="category-foot"><span>${data.items.filter(i=>i.category_id===c.id).length} menu items</span><span class="actions"><button class="text-btn" onclick="editCategory(${c.id})">Edit</button><button class="text-btn" onclick="deleteCategory(${c.id})">Delete</button></span></div></article>`).join("")||empty("No categories. Add your first category.");}
function renderItems(){
 const q=($("itemSearch")?.value||$("globalSearch").value).toLowerCase(),cat=$("categoryFilter").value,status=$("statusFilter").value,tag=$("tagFilter").value;
 const list=data.items.filter(i=>(!q||`${i.name} ${i.description}`.toLowerCase().includes(q))&&(!cat||String(i.category_id)===cat)&&(!status||i.status===status)&&(!tag||i.tags.includes(tag)));
 $("itemsGrid").innerHTML=list.map(i=>`<article class="item-card">${i.image?`<img class="item-image" src="${safe(i.image)}" alt="${safe(i.name)}" onerror="this.style.display='none'">`:`<div class="item-image">🍽️</div>`}<div class="item-body"><div class="item-top"><h3>${safe(i.name)}</h3><span class="price">${money(i.special_price??i.price)}</span></div><p>${safe(i.description)}</p><div class="tags">${i.tags.map(t=>`<span class="tag ${t==="Vegetarian"||t==="Vegan"?"veg":t==="Spicy"?"spicy":""}">${safe(t)}</span>`).join("")}<span class="status ${statusClass(i.status)}">${safe(i.status)}</span></div><div class="item-foot"><span>${safe(catName(i.category_id))}</span><span class="actions"><button class="text-btn" onclick="editItem(${i.id})">Edit</button><button class="text-btn" onclick="deleteItem(${i.id})">Delete</button></span></div></div></article>`).join("")||empty("No matching menu items found.");
}
function populateSelects(){
 const opts=data.categories.map(c=>`<option value="${c.id}">${safe(c.name)}</option>`).join("");
 $("categoryFilter").innerHTML='<option value="">All categories</option>'+opts;
 $("itemCategory").innerHTML=opts;
 $("tagFilter").innerHTML='<option value="">All dietary tags</option>'+TAGS.map(t=>`<option>${t}</option>`).join("");
}
function renderDigital(){
 $("digitalCategories").innerHTML=`<button class="${digitalFilter==="all"?"active":""}" data-digital="all">All menu</button>`+data.categories.map(c=>`<button class="${digitalFilter===String(c.id)?"active":""}" data-digital="${c.id}">${safe(c.icon)} ${safe(c.name)}</button>`).join("");
 const list=data.items.filter(i=>i.status!=="Out of Stock"&&(digitalFilter==="all"||String(i.category_id)===digitalFilter));
 $("digitalMenuGrid").innerHTML=list.map(i=>`<article class="digital-item">${i.image?`<img src="${safe(i.image)}" alt="${safe(i.name)}" onerror="this.style.display='none'">`:`<div class="food-thumb">🍽️</div>`}<div style="flex:1"><div style="display:flex;gap:8px"><h3>${safe(i.name)}</h3><span class="price">${money(i.special_price??i.price)}</span></div><p>${safe(i.description)}</p><div class="tags">${i.tags.map(t=>`<span class="tag">${safe(t)}</span>`).join("")}</div></div></article>`).join("")||empty("No dishes in this category right now.");
}
function renderPricing(){$("pricingTable").innerHTML=data.items.map(i=>`<tr><td><div class="table-item">${img(i.image,i.name)}<strong>${safe(i.name)}</strong></div></td><td>${money(i.price)}</td><td>${i.special_price?money(i.special_price):"—"}</td><td>${i.offer_start?`${i.offer_start} – ${i.offer_end}`:"—"}</td><td><span class="status ${i.special_price?"available":"limited-stock"}">${i.special_price?"Offer set":"Regular price"}</span></td><td><button class="text-btn" onclick="editOffer(${i.id})">${i.special_price?"Edit offer":"Set offer"}</button>${i.special_price?`<button class="text-btn" onclick="clearOffer(${i.id})">Remove</button>`:""}</td></tr>`).join("")||`<tr><td colspan="6">No menu items yet.</td></tr>`;}
function renderInventory(){
 const low=data.inventory.filter(i=>i.qty<=i.reorder).length;
 $("inventorySummary").innerHTML=[["Ingredients",data.inventory.length,"Tracked stock"],["Low stock",low,"Need reorder"],["Healthy stock",data.inventory.length-low,"Within stock level"],["Out of stock",data.inventory.filter(i=>i.qty===0).length,"Quantity is zero"]].map(([l,v,n])=>`<div class="stat-card"><div class="stat-top">${l}</div><div class="stat-value">${v}</div><div class="stat-note">${n}</div></div>`).join("");
 $("inventoryTable").innerHTML=data.inventory.map(i=>`<tr><td><strong>${safe(i.name)}</strong></td><td>${safe(i.usedIn||"—")}</td><td>${i.qty} ${safe(i.unit)}</td><td>${i.reorder} ${safe(i.unit)}</td><td><span class="status ${i.qty<=i.reorder?"limited-stock":"available"}">${i.qty===0?"Out of stock":i.qty<=i.reorder?"Low stock":"In stock"}</span></td><td><button class="text-btn" onclick="editInventory(${i.id})">Edit</button><button class="text-btn" onclick="deleteInventory(${i.id})">Delete</button></td></tr>`).join("")||`<tr><td colspan="6">No ingredients added.</td></tr>`;
}
function renderAnalytics(){
 const items=[...data.items].sort((a,b)=>b.orders-a.orders),max=Math.max(1,...items.map(i=>i.orders));
 $("analyticsStats").innerHTML=[["Total orders",data.items.reduce((s,i)=>s+i.orders,0),"Sample order count"],["Menu views",data.items.reduce((s,i)=>s+i.views,0),"Sample page views"],["Estimated revenue",money(data.items.reduce((s,i)=>s+i.orders*i.price,0)),"Orders × regular price"],["Top seller",items[0]?.name||"—","Most ordered item"]].map(([l,v,n])=>`<div class="stat-card"><div class="stat-top">${l}</div><div class="stat-value" style="font-size:${String(v).length>12?18:25}px">${safe(v)}</div><div class="stat-note">${n}</div></div>`).join("");
 $("ordersChart").innerHTML=items.slice(0,6).map(i=>`<div class="bar-row"><span>${safe(i.name.slice(0,15))}</span><div class="bar-track"><div class="bar-fill" style="width:${i.orders/max*100}%"></div></div><strong>${i.orders}</strong></div>`).join("");
 $("performanceList").innerHTML=items.slice(0,5).map((i,n)=>`<div class="performance-row"><span class="stat-icon">${n+1}</span><div class="grow"><strong>${safe(i.name)}</strong><small>${i.views} views · ${i.orders} orders</small></div><strong>${Math.round(i.orders/Math.max(1,i.views)*100)}%</strong></div>`).join("");
}
function renderReports(){
 const low=data.inventory.filter(i=>i.qty<=i.reorder);
 $("reportSummary").innerHTML=[["Menu items",data.items.length],["Categories",data.categories.length],["Ingredients",data.inventory.length],["Low stock alerts",low.length]].map(([l,v])=>`<div class="stat-card"><div class="stat-top">${l}</div><div class="stat-value">${v}</div><div class="stat-note">Current records</div></div>`).join("");
 $("menuReport").innerHTML=`<p class="muted">Items by category</p>`+data.categories.map(c=>`<div class="performance-row"><div class="grow"><strong>${safe(c.name)}</strong></div><strong>${data.items.filter(i=>i.category_id===c.id).length}</strong></div>`).join("")+`<p><strong>Menu value:</strong> ${money(data.items.reduce((s,i)=>s+i.price,0))}</p>`;
 $("inventoryReport").innerHTML=`<p><strong>${low.length}</strong> ingredients at or below reorder level</p>`+low.map(i=>`<div class="alert-row"><div class="grow"><strong>${safe(i.name)}</strong><small>${i.qty} ${safe(i.unit)} remaining</small></div><span class="status limited-stock">Restock</span></div>`).join("")||`<p class="muted">No stock alerts.</p>`;
}
function renderVersions(){$("versionList").innerHTML=data.versions.map(v=>`<div class="version-card"><div><strong>${safe(v.version)} · ${safe(v.note)}</strong><small>${safe(v.date)} · ${v.items.length} menu items · ${v.categories.length} categories</small></div><div><button class="btn light" onclick="restoreVersion(${v.id})">Restore</button><button class="text-btn" onclick="deleteVersion(${v.id})">Delete</button></div></div>`).join("")||empty("No snapshots yet. Save a snapshot to start tracking menu changes.");}

function openItem(id=null){$("itemForm").reset();$("itemId").value=id||"";$("itemDialogTitle").textContent=id?"Edit menu item":"Add menu item";const i=data.items.find(x=>x.id===id);if(i){$("itemName").value=i.name;$("itemCategory").value=i.category_id;$("itemPrice").value=i.price;$("itemImage").value=i.image||"";$("itemDescription").value=i.description;$("itemStatus").value=i.status;$("itemIngredients").value=i.ingredients.join(", ");$("itemAllergens").value=i.allergens.join(", ");} $("tagChoices").innerHTML=TAGS.map(t=>`<label class="tag-choice"><input type="checkbox" value="${safe(t)}" ${i?.tags.includes(t)?"checked":""}> ${safe(t)}</label>`).join("");$("itemDialog").showModal();}
function editItem(id){openItem(id);}
function deleteItem(id){if(!confirm("Delete this menu item?"))return;data.items=data.items.filter(i=>i.id!==id);snapshot("Menu item deleted");saveData("Menu item deleted");}
$("itemForm").addEventListener("submit",e=>{e.preventDefault();const id=Number($("itemId").value)||Date.now(),old=data.items.find(i=>i.id===id);const item={id,name:$("itemName").value.trim(),category_id:Number($("itemCategory").value),price:Number($("itemPrice").value),image:$("itemImage").value.trim(),description:$("itemDescription").value.trim(),status:$("itemStatus").value,ingredients:$("itemIngredients").value.split(",").map(x=>x.trim()).filter(Boolean),allergens:$("itemAllergens").value.split(",").map(x=>x.trim()).filter(Boolean),tags:[...$("tagChoices").querySelectorAll("input:checked")].map(x=>x.value),orders:old?.orders||0,views:old?.views||0,special_price:old?.special_price||null,offer_start:old?.offer_start||"",offer_end:old?.offer_end||""};if(old)data.items=data.items.map(x=>x.id===id?item:x);else data.items.push(item);snapshot(old?"Menu item edited":"Menu item added");$("itemDialog").close();saveData("Menu item saved");});

function openCategory(id=null){$("categoryForm").reset();$("categoryId").value=id||"";const c=data.categories.find(x=>x.id===id);$("categoryDialogTitle").textContent=c?"Edit category":"Add category";if(c){$("categoryName").value=c.name;$("categoryDescription").value=c.description;$("categoryIcon").value=c.icon;}$("categoryDialog").showModal();}
function editCategory(id){openCategory(id);}
function deleteCategory(id){if(data.items.some(i=>i.category_id===id)){alert("Move or delete this category's menu items before deleting it.");return;}if(!confirm("Delete this category?"))return;data.categories=data.categories.filter(c=>c.id!==id);snapshot("Category deleted");saveData("Category deleted");}
$("categoryForm").addEventListener("submit",e=>{e.preventDefault();const id=Number($("categoryId").value)||Date.now(),c={id,name:$("categoryName").value.trim(),description:$("categoryDescription").value.trim(),icon:$("categoryIcon").value||"🍽️"};const old=data.categories.some(x=>x.id===id);data.categories=old?data.categories.map(x=>x.id===id?c:x):[...data.categories,c];snapshot(old?"Category edited":"Category added");$("categoryDialog").close();saveData("Category saved");});
function openInventory(id=null){$("inventoryForm").reset();$("inventoryId").value=id||"";const i=data.inventory.find(x=>x.id===id);$("inventoryDialogTitle").textContent=i?"Edit ingredient":"Add ingredient";if(i){$("inventoryName").value=i.name;$("inventoryUsedIn").value=i.usedIn;$("inventoryQty").value=i.qty;$("inventoryUnit").value=i.unit;$("inventoryReorder").value=i.reorder;}$("inventoryDialog").showModal();}
function editInventory(id){openInventory(id);}
function deleteInventory(id){if(!confirm("Delete this ingredient?"))return;data.inventory=data.inventory.filter(i=>i.id!==id);snapshot("Inventory item deleted");saveData("Ingredient deleted");}
$("inventoryForm").addEventListener("submit",e=>{e.preventDefault();const id=Number($("inventoryId").value)||Date.now(),i={id,name:$("inventoryName").value.trim(),usedIn:$("inventoryUsedIn").value.trim(),qty:Number($("inventoryQty").value),unit:$("inventoryUnit").value.trim(),reorder:Number($("inventoryReorder").value)};const old=data.inventory.some(x=>x.id===id);data.inventory=old?data.inventory.map(x=>x.id===id?i:x):[...data.inventory,i];snapshot(old?"Inventory updated":"Ingredient added");$("inventoryDialog").close();saveData("Inventory saved");});
function editOffer(id){const i=data.items.find(x=>x.id===id);$("offerItemId").value=id;$("specialPrice").value=i.special_price??(i.price*.9).toFixed(2);$("offerStart").value=i.offer_start||new Date().toISOString().slice(0,10);$("offerEnd").value=i.offer_end||new Date(Date.now()+7*864e5).toISOString().slice(0,10);$("offerDialog").showModal();}
function clearOffer(id){const i=data.items.find(x=>x.id===id);i.special_price=null;i.offer_start="";i.offer_end="";snapshot("Special price removed");saveData("Offer removed");}
$("offerForm").addEventListener("submit",e=>{e.preventDefault();const i=data.items.find(x=>x.id===Number($("offerItemId").value));const p=Number($("specialPrice").value);if(p>=i.price){alert("Special price should be lower than the regular price.");return;}if($("offerEnd").value<$("offerStart").value){alert("End date must be on or after start date.");return;}i.special_price=p;i.offer_start=$("offerStart").value;i.offer_end=$("offerEnd").value;snapshot("Special price updated");$("offerDialog").close();saveData("Offer saved");});
function restoreVersion(id){const v=data.versions.find(x=>x.id===id);if(!v||!confirm(`Restore ${v.version}? Current menu will be replaced.`))return;data.items=structuredClone(v.items);data.categories=structuredClone(v.categories);snapshot(`Restored ${v.version}`);saveData("Menu version restored");}
function deleteVersion(id){if(!confirm("Delete this version record?"))return;data.versions=data.versions.filter(v=>v.id!==id);saveData("Version deleted");}

function exportCSV(){const rows=[["Name","Category","Price","Special Price","Status","Dietary Tags","Ingredients","Allergens"],...data.items.map(i=>[i.name,catName(i.category_id),i.price,i.special_price??"",i.status,i.tags.join("; "),i.ingredients.join("; "),i.allergens.join("; ")])];const csv=rows.map(r=>r.map(v=>`"${String(v??"").replaceAll('"','""')}"`).join(",")).join("\n");download("menupro-menu.csv",csv,"text/csv");}
function download(name,content,type){const a=document.createElement("a"),url=URL.createObjectURL(new Blob([content],{type}));a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);}
function printCurrent(){window.print();}
function setupEvents(){
 document.querySelectorAll("[data-page]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();showPage(a.dataset.page);}));
 document.querySelectorAll("[data-goto]").forEach(a=>a.addEventListener("click",()=>showPage(a.dataset.goto)));
 document.querySelectorAll("[data-open-item]").forEach(a=>a.addEventListener("click",()=>openItem()));
 $("addItemBtn").onclick=()=>openItem();$("addCategoryBtn").onclick=()=>openCategory();$("addInventoryBtn").onclick=()=>openInventory();
 $("itemSearch").oninput=renderItems;$("categoryFilter").onchange=renderItems;$("statusFilter").onchange=renderItems;$("tagFilter").onchange=renderItems;
 $("globalSearch").oninput=()=>{showPage("items");$("itemSearch").value=$("globalSearch").value;renderItems();};
 $("digitalCategories").addEventListener("click",e=>{const b=e.target.closest("[data-digital]");if(b){digitalFilter=b.dataset.digital;renderDigital();}});
 $("printMenuBtn").onclick=printCurrent;$("printReportBtn").onclick=printCurrent;$("exportCsvBtn").onclick=exportCSV;
 $("snapshotBtn").onclick=()=>{snapshot("Manual snapshot");saveData("Menu snapshot saved");};
 $("qrBtn").onclick=()=>{ $("qrPanel").classList.remove("hidden");$("qrcode").innerHTML="";if(window.QRCode)new QRCode($("qrcode"),{text:location.href.split("#")[0]+"#digital-menu",width:150,height:150});else $("qrcode").textContent="QR library unavailable. Use the digital menu URL.";};
 $("closeQr").onclick=()=>$("qrPanel").classList.add("hidden");
 $("themeBtn").onclick=()=>{document.body.classList.toggle("dark");data.dark=document.body.classList.contains("dark");localStorage.setItem(STORAGE_KEY,JSON.stringify(data));};
 $("languageBtn").onclick=()=>{data.language=data.language==="en"?"hi":"en";$("languageBtn").textContent=data.language==="en"?"EN / HI":"HI / EN";$("pageTitle").textContent=data.language==="hi"?"मेनू प्रबंधन":$("pageTitle").textContent;toast(data.language==="hi"?"भाषा टॉगल किया गया (डेमो)":"English selected");};
 $("menuToggle").onclick=()=>$("sidebar").classList.toggle("open");
 document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$(b.dataset.close).close());
 $("loginForm").onsubmit=e=>{e.preventDefault();if(!$("loginEmail").value||$("loginPassword").value.length<4){$("loginError").textContent="Enter a valid email and password (at least 4 characters).";return;}data.user={email:$("loginEmail").value,role:$("loginRole").value};localStorage.setItem(STORAGE_KEY,JSON.stringify(data));startApp();};
 $("logoutBtn").onclick=()=>{data.user=null;localStorage.setItem(STORAGE_KEY,JSON.stringify(data));$("app").classList.add("hidden");$("loginScreen").classList.remove("hidden");};
}
function startApp(){if(!data.user)return;$("loginScreen").classList.add("hidden");$("app").classList.remove("hidden");$("userName").textContent=data.user.email.split("@")[0];$("userRole").textContent=data.user.role;$("todayLabel").textContent=new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"}).toUpperCase();if(data.dark)document.body.classList.add("dark");renderAll();showPage(location.hash.slice(1)||"dashboard");}
setupEvents();if(data.user)startApp();else{$("loginScreen").classList.remove("hidden");$("app").classList.add("hidden");}
