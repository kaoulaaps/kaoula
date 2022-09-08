const inviteValue = document.getElementById("invite-value").value;
const inviteBtn = document.getElementById("invite-btn");

inviteBtn.addEventListener("click", () => {
    alert("Linket blev kopiret!");

    navigator.clipboard.writeText(inviteValue);
});
