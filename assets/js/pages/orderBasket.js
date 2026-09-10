(function(){
  "use strict";
  const sidebar=document.getElementById("storeSidebar");
  const backdrop=document.getElementById("sidebarBackdrop");
  const toggle=document.getElementById("sidebarToggle");
  const closeButton=document.getElementById("sidebarClose");
  const items=document.getElementById("basketItems");
  const count=document.getElementById("itemsCount");
  const cartBadge=document.querySelector(".basket-count");
  const toast=document.querySelector(".toast");
  let toastTimer;

  const mobileScreen=window.matchMedia("(max-width: 991px)");
  function setSidebar(open){
    sidebar.hidden=false;
    sidebar.classList.toggle("is-open",open);
    sidebar.classList.toggle("is-collapsed",!open&&!mobileScreen.matches);
    sidebar.setAttribute("aria-hidden",String(!open));
    toggle.setAttribute("aria-expanded",String(open));
    toggle.setAttribute("aria-label",open?"إغلاق القائمة الجانبية":"فتح القائمة الجانبية");
    toggle.querySelector("i")?.classList.toggle("bi-list",!open);
    toggle.querySelector("i")?.classList.toggle("bi-x-lg",open);
    document.body.classList.toggle("sidebar-layout-open",open&&!mobileScreen.matches);
    backdrop.hidden=!open||!mobileScreen.matches;
    document.body.style.overflow=open&&mobileScreen.matches?"hidden":"";
    if(open&&mobileScreen.matches)closeButton.focus();
  }
  toggle.addEventListener("click",()=>setSidebar(!sidebar.classList.contains("is-open")));
  closeButton.addEventListener("click",()=>setSidebar(false));
  backdrop.addEventListener("click",()=>setSidebar(false));
  sidebar.addEventListener("click",event=>{if(event.target.closest("a")&&mobileScreen.matches)setSidebar(false)});
  mobileScreen.addEventListener("change",()=>setSidebar(false));
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&sidebar.classList.contains("is-open")){setSidebar(false);toggle.focus()}});

  const profileToggle=document.getElementById("profileMenuToggle");
  const profileDropdown=document.getElementById("profileDropdown");
  const notificationsToggle=document.getElementById("notificationsToggle");
  const notificationsPanel=document.getElementById("notificationsPanel");
  function closeMenus(){profileDropdown.hidden=true;notificationsPanel.hidden=true;profileToggle.setAttribute("aria-expanded","false");notificationsToggle.setAttribute("aria-expanded","false")}
  profileToggle.addEventListener("click",event=>{event.stopPropagation();const open=profileDropdown.hidden;closeMenus();profileDropdown.hidden=!open;profileToggle.setAttribute("aria-expanded",String(open))});
  notificationsToggle.addEventListener("click",event=>{event.stopPropagation();const open=notificationsPanel.hidden;closeMenus();notificationsPanel.hidden=!open;notificationsToggle.setAttribute("aria-expanded",String(open))});
  document.addEventListener("click",event=>{if(!event.target.closest(".profile-menu,.notifications-menu"))closeMenus()});
  function logout(){if(window.confirm("هل تريد تسجيل الخروج من حسابك؟"))window.location.href="login.html"}
  document.getElementById("storeSidebarLogout")?.addEventListener("click",logout);
  document.querySelector(".profile-dropdown__logout")?.addEventListener("click",logout);

  function message(text){clearTimeout(toastTimer);toast.textContent=text;toast.classList.add("show");toastTimer=setTimeout(()=>toast.classList.remove("show"),1800)}
  function syncCount(){
    const total=items.querySelectorAll(".basket-item").length;
    count.textContent=total;
    cartBadge.textContent=total;
    cartBadge.hidden=total===0;
    return total;
  }
  items.addEventListener("click",event=>{
    const item=event.target.closest(".basket-item");if(!item)return;
    if(event.target.closest(".remove-item")){
      item.remove();
      const remaining=syncCount();
      message("تم حذف المنتج من السلة");
      if(!remaining)setTimeout(()=>{window.location.href="emptyBasket.html"},350);
      return;
    }
    const action=event.target.closest("[data-action]");if(!action)return;
    const output=item.querySelector("output");let quantity=Number(output.value||output.textContent);
    quantity=action.dataset.action==="increase"?quantity+1:Math.max(1,quantity-1);
    output.value=quantity;output.textContent=quantity;item.querySelector(".price-qty").textContent=quantity;
    item.querySelector(".item-price strong").textContent=`$${(Number(item.dataset.price)*quantity).toFixed(2)}`;
  });
  document.querySelector(".notifications-clear")?.addEventListener("click",()=>{document.querySelector(".notifications-list").replaceChildren();document.querySelector(".notifications-empty").hidden=false;notificationsPanel.hidden=true;notificationsToggle.setAttribute("aria-expanded","false");message("تم مسح الإشعارات")});
})();
