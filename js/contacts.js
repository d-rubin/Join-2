let contacts = [];
let allUsersAndContacts;
let contactColors = ["green", "blue", "blueviolet", "brown", "red", "yellow", "azure", "aqua", "orange", "deeppink"];
let mediaForContact = window.matchMedia("(max-width: 992px)");
let indexContact = 0;

async function getInfoFromNewContactField() {
   if (firstname.value != "") {
      createNewContact();
   }
   await saveContactInBackend(contacts);

   closeNewContactWindow();
   renderContacts();
   checkMediaforExitButton(mediaForContact);
}

function createNewContact() {
   let firstname = document.getElementById("firstname");
   let secondname = document.getElementById("secondname");
   let email = document.getElementById("email");
   let phone = document.getElementById("phone");

   contacts.push({
      first_name: firstname.value,
      second_name: secondname.value,
      initials: (secondname.value.charAt(0) + firstname.value.charAt(0)).toUpperCase(),
      email: email.value,
      phone: phone.value,
      addetAt: new Date().getTime(),
   });

   firstname.value = "";
   secondname.value = "";
   email.value = "";
   phone.value = "";
}

async function editcontact() {
   let firstname = document.getElementById("edit_firstname");
   let secondname = document.getElementById("edit_secondname");
   let email = document.getElementById("edit_email");
   let phone = document.getElementById("edit_phone");

   (contacts[indexContact].first_name = firstname.value),
      (contacts[indexContact].second_name = secondname.value),
      (contacts[indexContact].initials = (secondname.value.charAt(0) + firstname.value.charAt(0)).toUpperCase()),
      (contacts[indexContact].email = email.value),
      (contacts[indexContact].phone = phone.value),
      (contacts[indexContact].addetAt = new Date().getTime()),
      await saveContactInBackend(contacts);

   firstname.value = "";
   secondname.value = "";
   email.value = "";
   phone.value = "";
   closeEditContactWindow();
   renderContacts();
}

/**
 * Save the new contact in the backend JSON
 *
 * @param {[]} contacts => new contact to save
 */
async function saveContactInBackend(contacts) {
   await backend.setItem("contacts", JSON.stringify(contacts));
}

function renderContacts() {
   contacts.sort((a, b) => a.second_name.localeCompare(b.second_name));

   document.getElementById("listning").innerHTML = "";
   for (let i = 0; i < contacts.length; i++) {
      document.getElementById("listning").innerHTML += generateContactHTML(contacts[i], i);
   }
}

function generateContactHTML(contact, i) {
   let initials = contact.second_name.charAt(0) + contact.first_name.charAt(0).toUpperCase();
   return `
   <div class="full_listner">
       <div class="contact_name_container" onclick="showFullContactInfo(${i})">
           <span class="contact_name_container_span" style="background-color:${getColorForName(initials)}">${initials}</span>
           <div class="contact_name">
               <p>${contact.second_name} ${contact.first_name}</p>
               <a class="contacts-email" href="#"><p>${contact.email}</p></a>
           </div>
       </div>
     
   </div>
   `;
}

function loadAllTasks() {
   let allTasksAsString = localStorage.getItem("allTasks");
   contacts = JSON.parse(allTasksAsString);
}

function openNewContactWindow() {
   document.getElementById("popupAddContact").classList.remove("d-none");
   document.getElementById("contactsContainer").style = "filter: blur(10px)";
   document.getElementById("headerAllSide").style = "filter: blur(10px)";
   document.getElementById("navBarAllSide").style = "filter: blur(10px)";
   document.getElementById("popupAddContact").classList.add("popup_window_slidein");
   setTimeout(() => {
      document.getElementById("popupAddContact").style = "transform: translateX(0vw)";
   }, 300);
}

function openEditContactWindow(i) {
   indexContact = i;
   document.getElementById("popupEditContact").classList.remove("d-none");
   document.getElementById("edit_firstname").value = contacts[i].first_name;
   document.getElementById("edit_secondname").value = contacts[i].second_name;
   document.getElementById("edit_email").value = contacts[i].email;
   document.getElementById("edit_phone").value = contacts[i].phone;
   document.getElementById("contactsContainer").style = "filter: blur(10px)";
   document.getElementById("headerAllSide").style = "filter: blur(10px)";
   document.getElementById("navBarAllSide").style = "filter: blur(10px)";
   document.getElementById("popupEditContact").classList.add("popup_window_slidein");
   setTimeout(() => {
      document.getElementById("popupEditContact").style = "transform: translateX(0vw)";
   }, 300);
}

function closeEditContactMobil() {
   document.getElementById("full_contact_Info_Container").classList.add("d-none");
}

function closeNewContactWindow() {
   document.getElementById("firstname").value = ``;
   document.getElementById("secondname").value = ``;
   document.getElementById("email").value = ``;
   document.getElementById("phone").value = ``;
   document.getElementById("popupAddContact").style = "animation: slideout 0.3s;";
   document.getElementById("popupAddContact").classList.remove("popup_window_slidein");
   document.getElementById("popupAddContact").classList.remove("popup_window_slidein");
   document.getElementById("popupAddContact").classList.add("popup_window_slideout");
   document.getElementById("contactsContainer").style = "filter: none;";
   document.getElementById("headerAllSide").style = "filter: none";
   document.getElementById("navBarAllSide").style = "filter: none";
   setTimeout(() => {
      document.getElementById("popupAddContact").classList.add("d-none");
      document.getElementById("contactsContainer").style = "filter: none;";
      document.getElementById("popupAddContact").style = "transform: translateX(100vw)";
   }, 300);
}

function closeEditContactWindow() {
   document.getElementById("edit_firstname").value = ``;
   document.getElementById("edit_secondname").value = ``;
   document.getElementById("edit_email").value = ``;
   document.getElementById("edit_phone").value = ``;
   document.getElementById("popupEditContact").style = "animation: slideout 0.3s;";
   document.getElementById("popupEditContact").classList.remove("popup_window_slidein");
   document.getElementById("popupEditContact").classList.remove("popup_window_slidein");
   document.getElementById("popupEditContact").classList.add("popup_window_slideout");
   document.getElementById("contactsContainer").style = "filter: none;";
   document.getElementById("headerAllSide").style = "filter: none";
   document.getElementById("navBarAllSide").style = "filter: none";
   setTimeout(() => {
      document.getElementById("popupEditContact").classList.add("d-none");
      document.getElementById("contactsContainer").style = "filter: none;";
      document.getElementById("popupEditContact").style = "transform: translateX(100vw)";
   }, 300);
}

async function removeContact(i) {
   contacts.splice(i, 1);
   await saveContactInBackend(contacts);
   renderContacts();
}

async function showFullContactInfo(i) {
   document.getElementById("full_contact_Info_Container").classList.remove("d-none");
   let fullContactInfo = document.getElementById("full_contact_Info_Container");
   fullContactInfo.innerHTML = "";
   fullContactInfo.innerHTML += generateFullConatactHTML(i);
}

function generateFullConatactHTML(i) {
   let initials = contacts[i].initials;
   return /*html*/ `
   <div class="full_contact_info">
       <h2 style="background-color:${getColorForName(initials)}">${initials}</h2>
       <div class="contact_info_add_task">
           <div class="contact_info_add_task_name">${contacts[i].first_name} ${contacts[i].second_name}</div>
           <div class="contact_info_add_task_name_add_task" onclick="openFormContacts()" style="cursor: pointer;">+ Add Task</div>
       </div>
   </div>
   <div class="contact_information_header">
       <div class="contacts-information">Contact Information</div>
       <div class="edit_contact" onclick="openEditContactWindow(${i})">
           <img class="cursor-pointer" src="img/pencil.png">
           <p>Edit Contact</p>
       </div>
        <div class="contain-trash-icon">
       <img class="trash-icon" src="img/trash-can.png" onclick="removeContact(${i})">
       </div>
   </div>
  
   <div class="contact_information">
   <div class="block-contact_information">    
   <div class="contacts-information">Email</div>
       <a href="#">${contacts[i].email}</a>
       </div>
       <div class="block-contact_information">    
       <div class="contacts-information">Phone</div>
       <div>${contacts[i].phone}</div></div>
   </div>

    <div class="cancel-edit-mobil-btn" onclick="closeEditContactMobil()">
                                <p>Cancel</p>
                                <img src="img/clear.png">
                            </div>
                              
   `;
}

function getColorForName(initials) {
   let number = (initials.charCodeAt(0) + initials.charCodeAt(1)) % contactColors.length;
   return contactColors[number];
}

function checkMediaforExitButton(mediaForContact) {
   let btn = document.getElementById("close_contact_btn");

   if (mediaForContact.matches) {
      btn.src = "img/clear_white.png";
   } else {
      btn.src = "img/clear.png";
   }
}

function openFormContacts() {
   document.getElementById("popup-windowContacts").style.display = "unset";
   setAllUserAndContactsAssignedToPopupContacts();
}

function setAllUserAndContactsAssignedToPopupContacts() {
   allUsersAndContacts = [].concat(contacts, users);
   let assignCount = 0;
   let optionTag = document.getElementById("assignedto-popupContacts");
   optionTag.innerHTML = " ";
   allUsersAndContacts.forEach((user) => {
      currentAssigned.push("");
      optionTag.innerHTML += `<div class="assignedToValue"><p>${user.second_name} ${user.first_name}</p><img id="popupAssignedToCheckboxContacts${assignCount}" src="assets/img/addTask_rectangle.png" onclick="changeAssignPopupContacts(${assignCount})"></div>`;
      assignCount += 1;
   });
}

function closeFormContacts() {
   document.getElementById("popup-windowContacts").style.display = "none";
   let titlePopup = document.getElementById("titlePopupContacts");
   let descriptionPopup = document.getElementById("descriptionPopupContacts");
   let duedatePopup = document.getElementById("duedatePopupContacts");
   resetPrioColorContacts();
   resetCheckboxesPopupContacts();
   //  resetValuesContacts(titlePopup, descriptionPopup, duedatePopup);
}

function resetValuesContacts(titlePopup, descriptionPopup, duedatePopup) {
   titlePopup.value = ``;
   descriptionPopup.value = ``;
   duedatePopup.value = ``;
}

function resetPrioColorContacts() {
   document.getElementById("addSubtasksInputPopupContacts").value = "";
   document.getElementById("addSubtasksListPopupContacts").innerHTML = "";
   document.getElementById("urgentPopupContacts").classList.remove("urgent-bg-color");
   document.getElementById("mediumPopupContacts").classList.remove("medium-bg-color");
   document.getElementById("lowPopupContacts").classList.remove("low-bg-color");
   document.getElementById("lowFirstPopupContacts").classList.remove("change-color-img");
   document.getElementById("lowSecondPopupContacts").classList.remove("change-color-img");
   document.getElementById("mediumSecondPopupContacts").classList.remove("change-color-img");
   document.getElementById("mediumFirstPopupContacts").classList.remove("change-color-img");
   document.getElementById("urgentFirstPopupContacts").classList.remove("change-color-img");
   document.getElementById("urgentSecondPopupContacts").classList.remove("change-color-img");
}

function resetCheckboxesPopupContacts() {
   for (let i = 0; i < allUsersAndContacts.lenght; i++) {
      document.getElementById(`popupAssignedToCheckboxContacts${i}`).src = "https://gruppe-340.developerakademie.net/Join/assets/img/addTask_rectangle.png";
   }
}

function changeAssignPopupContacts(assignCount) {
   let img = document.getElementById(`popupAssignedToCheckboxContacts${assignCount}`);
   if (img.src == "https://gruppe-340.developerakademie.net/Join/assets/img/addTask_rectangle.png") {
      currentAssigned.splice(assignCount, 1, allUsersAndContacts[assignCount].second_name);
      img.src = "assets/img/checkbox.png";
   } else if (img.src == "https://gruppe-340.developerakademie.net/Join/assets/img/checkbox.png") {
      img.src = "assets/img/addTask_rectangle.png";
      currentAssigned.splice(assignCount, 1, "");
   }
}
/*
 * change bg color of urgent Popup
 */
function changeColorUrgentContacts() {
   currentPrior = document.getElementById("urgentPopupContacts").innerText;
   let urgent = document.getElementById("urgentPopupContacts");
   let medium = document.getElementById("mediumPopupContacts");
   let low = document.getElementById("lowPopupContacts");
   urgent.classList.add("urgent-bg-color");
   medium.classList.remove("medium-bg-color");
   low.classList.remove("low-bg-color");
   changeColorUrgentReverseContacts();
}

function changeColorUrgentReverseContacts() {
   let changeColorFirst = document.getElementById("mediumFirstPopupContacts");
   let changeColorSecond = document.getElementById("mediumSecondPopupContacts");
   changeColorFirst.classList.remove("change-color-img");
   changeColorSecond.classList.remove("change-color-img");
   let changeColorFirstLow = document.getElementById("lowFirstPopupContacts");
   let changeColorSecondLow = document.getElementById("lowSecondPopupContacts");
   changeColorFirstLow.classList.remove("change-color-img");
   changeColorSecondLow.classList.remove("change-color-img");
   let changeColorFirstUrgent = document.getElementById("urgentFirstPopupContacts");
   let changeColorSecondUrgent = document.getElementById("urgentSecondPopupContacts");
   changeColorFirstUrgent.classList.add("change-color-img");
   changeColorSecondUrgent.classList.add("change-color-img");
}

/*
 * change bg color of medium Popup
 */
function changeColorMediumContacts() {
   currentPrior = document.getElementById("mediumPopupContacts").innerText;
   let urgent = document.getElementById("urgentPopupContacts");
   let medium = document.getElementById("mediumPopupContacts");
   let low = document.getElementById("lowPopupContacts");
   urgent.classList.remove("urgent-bg-color");
   medium.classList.add("medium-bg-color");
   low.classList.remove("low-bg-color");
   changeColorMediumReverseContacts();
}

function changeColorMediumReverseContacts() {
   let changeColorFirst = document.getElementById("mediumFirstPopupContacts");
   let changeColorSecond = document.getElementById("mediumSecondPopupContacts");
   changeColorFirst.classList.add("change-color-img");
   changeColorSecond.classList.add("change-color-img");
   let changeColorFirstLow = document.getElementById("lowFirstPopupContacts");
   let changeColorSecondLow = document.getElementById("lowSecondPopupContacts");
   changeColorFirstLow.classList.remove("change-color-img");
   changeColorSecondLow.classList.remove("change-color-img");
   let changeColorFirstUrgent = document.getElementById("urgentFirstPopupContacts");
   let changeColorSecondUrgent = document.getElementById("urgentSecondPopupContacts");
   changeColorFirstUrgent.classList.remove("change-color-img");
   changeColorSecondUrgent.classList.remove("change-color-img");
}

/*
 * change bg color of low Popup
 */
function changeColorLowContacts() {
   currentPrior = document.getElementById("lowPopupContacts").innerText;
   let urgent = document.getElementById("urgentPopupContacts");
   let medium = document.getElementById("mediumPopupContacts");
   let low = document.getElementById("lowPopupContacts");
   urgent.classList.remove("urgent-bg-color");
   medium.classList.remove("medium-bg-color");
   low.classList.add("low-bg-color");
   changeColorLowReverseContactsContacts();
}

function changeColorLowReverseContactsContacts() {
   let changeColorFirst = document.getElementById("mediumFirstPopupContacts");
   let changeColorSecond = document.getElementById("mediumSecondPopupContacts");
   changeColorFirst.classList.remove("change-color-img");
   changeColorSecond.classList.remove("change-color-img");
   let changeColorFirstLow = document.getElementById("lowFirstPopupContacts");
   let changeColorSecondLow = document.getElementById("lowSecondPopupContacts");
   changeColorFirstLow.classList.add("change-color-img");
   changeColorSecondLow.classList.add("change-color-img");
   let changeColorFirstUrgent = document.getElementById("urgentFirstPopupContacts");
   let changeColorSecondUrgent = document.getElementById("urgentSecondPopupContacts");
   changeColorFirstUrgent.classList.remove("change-color-img");
   changeColorSecondUrgent.classList.remove("change-color-img");
}

function addSubtaskPopupContacts() {
   let input = document.getElementById("addSubtasksInputPopupContacts");
   if (input.value != "") {
      document.getElementById("addSubtasksListPopupContacts").innerHTML += `
        <div class="subTaskSubFrame">
            <img id="subtask${subtaskCount}" src="assets/img/addTask_rectangle.png">
            <div class="">${input.value}</div>
        </div>`;
      currentSubtasks.push(input.value);
      currentInstance.push("todo");
      subtaskCount += 1;
      input.value = "";
   }
}

function setAllUserAndContactsToAssignedContacts() {
   allUsersAndContacts = [].concat(contacts, users);
   let assignCount = 0;
   let optionTag = document.getElementById("assignedtoContacts");
   optionTag.innerHTML = " ";
   if (!expanded) {
      allUsersAndContacts.forEach((user) => {
         currentAssigned.push("");
         optionTag.innerHTML += `
            <label>
        <input class="inputCheckboxField" type="checkbox" onclick="changeAssign(${assignCount})" id="Check${assignCount}"/>${user.second_name} ${user.first_name}</label>
`;
         optionTag.style.display = "block";
         expanded = true;
         assignCount += 1;
      });
   } else {
      optionTag.style.display = "none";
      expanded = false;
   }
}

function createTodoPopupContacts() {
   updateArrayTodoPopupContacts();
   currentTitle.value = ``;
   currentDescription.value = ``;
   currentDuedate.value = ``;
   changeColorAfterCreateTaskPopupContacts();
   closeFormContacts();
   changePrior();
   resetCheckboxesPopupContacts();
   subtaskCount = 0;
   index++;
   currentPrior = "Low";
}

function updateArrayTodoPopupContacts() {
   currentTitle = document.getElementById("titlePopupContacts");
   currentDescription = document.getElementById("descriptionPopupContacts");
   currentCategory = document.getElementById("category-popupContacts");
   currentDuedate = document.getElementById("duedatePopupContacts");
   pushTodosArray();
   currentAssigned = [];
   currentSubtasks = [];
   currentInstance = [];
   saveToDosInBackend(toDosArray);
   updateTasks();
}

function changeColorAfterCreateTaskPopupContacts() {
   let urgent = document.getElementById("urgentPopupContacts");
   let medium = document.getElementById("mediumPopupContacts");
   let low = document.getElementById("lowPopupContacts");
   urgent.classList.remove("change-color-img");
   medium.classList.remove("change-color-img");
   low.classList.remove("change-color-img");
   urgent.classList.remove("urgent-bg-color");
   medium.classList.remove("medium-bg-color");
   low.classList.remove("low-bg-color");
   changeColorAfterCreateTaskReverseContacts();
}

function changeColorAfterCreateTaskReverseContacts() {
   let changeColorFirstUrgent = document.getElementById("urgentFirstPopupContacts");
   let changeColorSecondUrgent = document.getElementById("urgentSecondPopupContacts");
   changeColorFirstUrgent.classList.remove("change-color-img");
   changeColorSecondUrgent.classList.remove("change-color-img");
   let changeColorFirst = document.getElementById("mediumFirstPopupContacts");
   let changeColorSecond = document.getElementById("mediumSecondPopupContacts");
   changeColorFirst.classList.remove("change-color-img");
   changeColorSecond.classList.remove("change-color-img");
   let changeColorFirstLow = document.getElementById("lowFirstPopupContacts");
   let changeColorSecondLow = document.getElementById("lowSecondPopupContacts");
   changeColorFirstLow.classList.remove("change-color-img");
   changeColorSecondLow.classList.remove("change-color-img");
}
