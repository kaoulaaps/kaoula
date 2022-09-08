const inviteValue = document.getElementById("invite-value").value;
const inviteBtn = document.getElementById("invite-btn");

inviteBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(inviteValue);
});
