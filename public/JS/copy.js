function copy(id) {

    // Get the text field
    const text = document.getElementById(id);
    const copyText = text.innerText;

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText);
    text.innerText = "Copied"

    // Alert the copied text
    alert("You copied the text: " + copyText + " to your clipboard");
}